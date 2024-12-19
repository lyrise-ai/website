export default function useRegisterationEvents() {
  function sendFirstFormSuccessEvent(formData) {
    const payload = {
      companyName: formData.companyName,
      companyWebsite: formData.companyWebsite,
      aiProjectTitle: formData.aiProjectTitle,
      aiProjectDetails: formData.aiProjectDetails,
      fundingStage: formData.fundingStage,
    }

    /// call the event api ...(SUCCESS)
    console.log('sendFirstFormSuccessEvent', payload)
  }

  function sendFirstFormFailureEvent(failureFormData) {
    const payload = {
      companyName: failureFormData.companyName,
      companyWebsite: failureFormData.companyWebsite,
      aiProjectTitle: failureFormData.aiProjectTitle,
      aiProjectDetails: failureFormData.aiProjectDetails,
      fundingStage: failureFormData.fundingStage,
    }

    /// call the event api ...(FAILURE)
    console.log('sendFirstFormFailureEvent', payload)
  }

  function sendSecondFormSuccessEvent(formData) {
    const payload = {
      fullName: formData.fullName,
      workEmail: formData.workEmail,
      phoneNumber: formData.phoneNumber,
    }

    /// call the event api ...(SUCCESS)
    console.log('sendSecondFormSuccessEvent', payload)
  }

  function sendSecondFormFailureEvent(failureFormData) {
    const payload = {
      fullName: failureFormData.fullName,
      workEmail: failureFormData.workEmail,
      phoneNumber: failureFormData.phoneNumber,
    }

    /// call the event api ...(FAILURE)
    console.log('sendSecondFormFailureEvent', payload)
  }

  return {
    sendFirstFormSuccessEvent,
    sendFirstFormFailureEvent,
    sendSecondFormSuccessEvent,
    sendSecondFormFailureEvent,
  }
}
