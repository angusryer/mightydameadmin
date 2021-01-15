import React from "react";

export default function Input({
	styles,
	label,
	identifier,
	type,
	value,
	changeHandler
}) {
	const { containerStyles, labelStyles, inputStyles } = styles;
	return (
		<div className={containerStyles}>
			<label htmlFor={identifier} className={labelStyles}>
				{label}
			</label>
			{type === "checkbox" ? (
				<input
					type={type}
					name={identifier}
					id={identifier}
					className={inputStyles}
					checked={value | false}
					onChange={(e) => changeHandler(e)}
				/>
			) : (
				<input
					type={type}
					name={identifier}
					id={identifier}
					className={inputStyles}
					value={value || ''}
					onChange={(e) => changeHandler(e)}
				/>
			)}
		</div>
	);
}
