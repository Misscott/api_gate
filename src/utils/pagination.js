const pagination = ({ limit, page }) => {
	const validateLimit = Number.isNaN(Number(limit)) || limit === '' ? 100 : Math.abs(limit)
	const validatePage = Number.isNaN(Number(page)) || page === '' ? 1 : Math.abs(page)

	const auxPage = Number.parseInt(validatePage) === 0 ? 1 : Number.parseInt(validatePage)
	const auxLimit = Math.abs(Number.parseInt(validateLimit))

	const offset = (Math.abs(auxPage) - 1) * auxLimit
	return ` LIMIT ${auxLimit} OFFSET ${offset} `
}

export { pagination }
