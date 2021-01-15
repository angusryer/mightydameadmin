import { useState, useRef, useEffect } from "react";

export function useFormFields(initialState) {
	const [fields, setValues] = useState(initialState);

	return [
		fields,
		function (event) {
			if (event.target.type === "checkbox") {
				setValues({
					...fields,
					[event.target.id]: event.target.checked
				});
			} else {
				setValues({
					...fields,
					[event.target.id]: event.target.value
				});
			}
		}
	];
}

export function usePrevious(value) {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}
