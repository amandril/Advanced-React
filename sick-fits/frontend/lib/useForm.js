import { useEffect, useState } from 'react';

export default function useForm(initial = {}) {
  // create a state object for our inputs
  const [inputs, setInputs] = useState(initial);
  const initialValues = Object.values(initial).join('');

  useEffect(() => {
    // This function runs when the thing we are watching change
    setInputs(initial);
  }, [initialValues]);

  function handleChange(e) {
    // change our number input back into a number to keep graphql happy
    let { value, name, type } = e.target;
    if (type === 'number') {
      value = parseInt(value);
    }
    if (type === 'file') {
      [value] = e.target.files;
    }
    setInputs({
      // Copy the existing state
      ...inputs,
      [name]: value,
    });
  }
  // fill the form with initial state
  function resetForm() {
    setInputs(initial);
  }
  // zero out all inputs
  // In the array, first entry is key, second is value
  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );
    setInputs(blankState);
  }

  // return the things we want to surface from this custom hok
  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
