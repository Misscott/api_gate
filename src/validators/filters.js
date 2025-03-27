const filterByStock = (arr, min = 0, max = Number.MAX_VALUE) => {
    return arr
            .filter((item) => item.stock >= min && item.stock <= max)
}

export {filterByStock}