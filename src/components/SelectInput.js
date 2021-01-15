import React from "react";

export default function SelectInput({
	styles,
	label,
	identifier,
	options,
	value,
	changeHandler
}) {
	const { containerStyles, inputStyles, labelStyles } = styles;
	return (
		<div className={containerStyles}>
			<label htmlFor={identifier} className={labelStyles}>
				{label}
			</label>
			<select
				name={identifier}
				id={identifier}
				className={inputStyles}
				onChange={(e) => changeHandler(e)}
				value={value}
			>
				{options.map((optionItem, i) => {
					return (
						<option key={i} value={optionItem}>
							{optionItem}
						</option>
					);
				})}
			</select>
		</div>
	);
}
