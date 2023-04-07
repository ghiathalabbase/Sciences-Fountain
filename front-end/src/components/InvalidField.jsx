function InvalidField({ isValidField,invlaidMessage }) {
  return (
    <span
      id="invalid-message"
      style={{ color: 'red' }}
    >
      {
        isValidField === false ?  invlaidMessage : null

      }
    </span>
  )
}

export default InvalidField