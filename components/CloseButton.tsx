export const CloseButton = ({handleClose}: { handleClose: () => void }) => {
  return (
    <button className="airesponse-button close" onClick={handleClose}>Close React View</button>
  )
}
