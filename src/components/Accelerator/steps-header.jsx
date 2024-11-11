const StepsHeader = ({ currentStep }) => (
  <header className="flex w-full">
    <StepsHeaderTab
      stepNumber={1}
      currentStep={currentStep}
      icon={<WorkIcon />}
    />
    <StepsHeaderTab
      stepNumber={2}
      currentStep={currentStep}
      icon={<UserIcon />}
    />
    <StepsHeaderTab
      stepNumber={3}
      currentStep={currentStep}
      icon={<ShareIcon />}
    />
  </header>
)

export default StepsHeader

export function StepsHeaderTab(props) {
  const { currentStep, icon, stepNumber, onClick } = props

  return (
    <div
      className={
        'flex-1 font-poppins flex gap-3 py-3 px-1 mb items-center justify-center' +
        (currentStep === stepNumber ? ' border-t-4 ' : ' border-t-2 ') +
        (currentStep > stepNumber - 1
          ? 'border-rose-500 text-rose-500'
          : 'border-neutral-300 text-neutral-300')
      }
    >
      {icon}
    </div>
  )
}

// Icons
const WorkIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M9.0887 5.25323C9.13109 5.21085 9.18857 5.18704 9.24852 5.18704H15.3786C15.4385 5.18704 15.496 5.21085 15.5384 5.25323C15.5808 5.29562 15.6046 5.35311 15.6046 5.41305V5.63907H9.0225V5.41305C9.0225 5.35311 9.04631 5.29562 9.0887 5.25323ZM7.0225 5.63907V5.41305C7.0225 4.82268 7.25703 4.25648 7.67449 3.83902C8.09194 3.42156 8.65814 3.18704 9.24852 3.18704H15.3786C15.969 3.18704 16.5352 3.42156 16.9526 3.83902C17.3701 4.25648 17.6046 4.82268 17.6046 5.41305V5.63907H19.0567C20.6246 5.63907 21.8957 6.91014 21.8957 8.47809V10.9301V17.0602C21.8957 18.6282 20.6246 19.8992 19.0567 19.8992H5.57051C4.00256 19.8992 2.73149 18.6282 2.73149 17.0602V10.9301V8.47809C2.73149 6.91014 4.00256 5.63907 5.57051 5.63907H7.0225ZM19.8957 8.47809V9.93012H14.7656H9.86155H4.73148V8.47809C4.73148 8.01471 5.10713 7.63907 5.57051 7.63907H19.0567C19.5201 7.63907 19.8957 8.01471 19.8957 8.47809ZM8.86403 11.9301H4.73148V17.0602C4.73148 17.5236 5.10713 17.8992 5.57051 17.8992H19.0567C19.5201 17.8992 19.8957 17.5236 19.8957 17.0602V11.9301H15.7631C15.7436 12.2473 15.6089 12.5475 15.3829 12.7735C15.1379 13.0185 14.8056 13.1561 14.4591 13.1561H10.1681C9.82155 13.1561 9.48924 13.0185 9.24422 12.7735C9.01824 12.5475 8.88359 12.2473 8.86403 11.9301Z"
      fill="currentColor"
    />
  </svg>
)

const UserIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const ShareIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="17.5"
      cy="4.5"
      r="2.5"
      stroke="currentColor"
      stroke-width="1.5"
    />
    <circle
      cx="5.5"
      cy="11.5"
      r="2.5"
      stroke="currentColor"
      stroke-width="1.5"
    />
    <path
      d="M15 6L8 10"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M7.5 13.5L15 18"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <circle
      cx="17.5"
      cy="19.5"
      r="2.5"
      stroke="currentColor"
      stroke-width="1.5"
    />
  </svg>
)
