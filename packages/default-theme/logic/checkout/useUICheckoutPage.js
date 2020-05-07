import { ref, computed, getCurrentInstance } from '@vue/composition-api'
import { CHECKOUT_STEPS } from '@shopware-pwa/default-theme/logic/checkout/steps'
import { getStepByNumber } from '@shopware-pwa/default-theme/logic/checkout/helpers'
import { useCheckout } from '@shopware-pwa/composables'
import { usePersonalDetailsStep } from '@shopware-pwa/default-theme/logic/checkout/usePersonalDetailsStep'
import { useShippingStep } from '@shopware-pwa/default-theme/logic/checkout/useShippingStep'
import { usePaymentStep } from '@shopware-pwa/default-theme/logic/checkout/usePaymentStep'
import { PAGE_ORDER_SUCCESS } from '@shopware-pwa/default-theme/helpers/pages'

export const useUICheckoutPage = () => {
  const { isGuestOrder, createOrder } = useCheckout()
  const currentStep = ref(
    isGuestOrder.value ? CHECKOUT_STEPS.PERSONAL_DETAILS : CHECKOUT_STEPS.REVIEW
  )
  const vm = getCurrentInstance()

  const {
    isValid: isPersonalDetailsStepValid,
    validate: validatePersonalDetailsStep,
  } = usePersonalDetailsStep()
  const {
    isValid: isShippingStepValid,
    validate: validateShippingStep,
  } = useShippingStep()
  const {
    isValid: isPaymentStepValid,
    validate: validatePaymentStep,
  } = usePaymentStep()

  const isPersonalDetailsStepCompleted = computed(() => {
    return !isGuestOrder.value || isPersonalDetailsStepValid.value
  })
  const isShippingStepCompleted = computed(() => {
    return !isGuestOrder.value || isShippingStepValid.value
  })
  const isPaymentStepCompleted = computed(() => {
    return !isGuestOrder.value || isPaymentStepValid.value
  })
  const isReviewStepAvailable = computed(() => {
    return !!isPaymentStepCompleted.value
  })

  const stepsStatus = computed(() => {
    return {
      PERSONAL_DETAILS: {
        available: true,
      },
      SHIPPING: {
        available: !!isPersonalDetailsStepCompleted.value,
      },
      PAYMENT: {
        available: !!isShippingStepCompleted.value,
      },
      REVIEW: {
        available: isReviewStepAvailable.value,
      },
    }
  })

  const nextStep = async (stepNumber) => {
    let nextStepNumber = stepNumber || currentStep.value + 1
    if (stepNumber === CHECKOUT_STEPS.PERSONAL_DETAILS)
      nextStepNumber = CHECKOUT_STEPS.PERSONAL_DETAILS

    if (
      currentStep.value === CHECKOUT_STEPS.PERSONAL_DETAILS &&
      currentStep.value !== nextStepNumber
    )
      validatePersonalDetailsStep()
    if (
      currentStep.value === CHECKOUT_STEPS.SHIPPING &&
      currentStep.value !== nextStepNumber
    )
      validateShippingStep()
    if (
      currentStep.value === CHECKOUT_STEPS.PAYMENT &&
      currentStep.value !== nextStepNumber
    )
      validatePaymentStep()

    if (
      currentStep.value === CHECKOUT_STEPS.REVIEW &&
      nextStepNumber > CHECKOUT_STEPS.REVIEW
    ) {
      const order = await createOrder()
      vm.$router.push(`${PAGE_ORDER_SUCCESS}?orderId=${order.id}`)
    } else {
      const nextStep = getStepByNumber(nextStepNumber)
      if (stepsStatus.value[nextStep].available) {
        currentStep.value = nextStepNumber
        vm.$router.push({
          query: { step: nextStep },
        })
      }
    }
  }

  return {
    currentStep,
    nextStep,
  }
}
