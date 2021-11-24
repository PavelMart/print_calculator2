"use strict"
document.addEventListener("DOMContentLoaded", () => {
    const warning = document.querySelector(".warning")
    const material = document.querySelector(".material")
    const additionalWorks = document.querySelector(".additional-works")
    const addWorks = document.querySelector(".add-works")

    const calcBtn = document.getElementById("calculate")
    const resetBtn = document.getElementById("reset")
    const price = document.getElementById("price")
    const priceOne = document.getElementById("price__one")

    const printTypeSelect = document.getElementById("print-type__select")

    const printTypeResult = document.getElementById("print-type-result")
    const sizeResult = document.getElementById("size-result")
    const countResult = document.getElementById("count-result")
    const materialResult = document.getElementById("material-result")
    const mainResult = document.getElementById("main-result")
    const mainOneResult = document.getElementById("main-one-result")

    const warningSquare = (square) => `Минимальный заказ - 0,3 кв.м. Ваш текущий заказ - ${square} кв.м.`
    const warningMaterials = () => `Выберите материал/качество печати`
    const warningWidth = () => `Введите ширину`
    const warningHeight = () => `Введите высоту`
    const warningCount = () => `Введите количество`

    const materialTemplate = (elem) => {
        const material = elem.material
        const type = elem.type ? ` ${elem.type}` : ""
        const density = elem.density ? ` ${elem.density} гр./кв.м.` : ""
        const color = elem.color ? ` ${elem.color}` : ""
        const quality = elem.quality ? ` - ${elem.quality} dpi` : ""

        return `${material}${type}${color}${density}${quality}`
    }

    const materialRadioTemplate = (elem, format) => `<div class="item__radio-container">
                <input
                    class="item__input_radio"
                    type="radio"
                    name="material"
                    id="material_${elem.value}"
                    value="${elem.value}"
                />
                <label class="item__input item__input_radio_button" for="material_${elem.value}"
                    >${format}</label
                >
            </div>`

    const additionalWorksRadioTemplate = (elem) => `<div class="item__checkbox-container">
                <input
                    class="item__input_checkbox"
                    type="checkbox"
                    name="addwork"
                    id="addwork_${elem.value}"
                    value="${elem.value}"
                />
                <label class="item__input item__input_checkbox_button" for="addwork_${elem.value}"
                    >${elem.title}</label
                >
            </div>`

    const checkMaterial = (value) => {
        const printTypeValue = getPrintTypeValue()
        const printType = checkPrintType(printTypeValue)
        return printType.options[value - 1]
    }

    const checkPrintType = (value) => {
        for (let elem of configuration) {
            if (value === elem.title) {
                return elem
            }
        }
    }

    const checkParameterValue = (parameter, template) => {
        if (parameter < 0.3) {
            warning.style.display = "block"
            warning.textContent = template
            return false
        } else {
            warning.style.display = ""
            return true
        }
    }

    const checkParameterExistence = (parameter, template) => {
        if (!parameter) {
            warning.style.display = "block"
            warning.textContent = template
            return false
        } else {
            warning.style.display = ""
            return true
        }
    }

    const getSelectedAddWorks = () => {
        return document.querySelectorAll(".item__input_checkbox:checked")
    }

    const getAddWorksOptions = (selectedAddWorks) => {
        return [...selectedAddWorks].map((work) => {
            const options = configuration[configuration.length - 1]
            const optionsList = options.options
            return optionsList[work.value - 1]
        })
    }

    const getNumberData = (id) => {
        return +document.getElementById(id).value
    }

    const getPrintTypeValue = () => {
        return printTypeSelect.value
    }

    const getMaterialValue = () => {
        const checkedInput = document.querySelector(".item__input_radio:checked")
        if (checkedInput) return document.querySelector(".item__input_radio:checked").value
    }

    const getElemCost = (square, prices) => {
        if (square <= 1) return +prices.upTo1
        if (square <= 5) return +prices.upTo1
        if (square <= 20) return +prices.upTo20
        if (square <= 100) return +prices.upTo100
        if (square > 100) return +prices.over100
    }

    const getItemBody = (node) => {
        return node.querySelector(".item__body")
    }

    const setMaterialOptions = (e, node) => {
        const nodeValue = node ? node : e.target.value
        const printType = checkPrintType(nodeValue)
        const optionList = printType.options
        const itemBody = getItemBody(material)

        clearItemBody(itemBody)

        optionList.forEach((option) => {
            const template = materialTemplate(option)
            const radioTemplate = materialRadioTemplate(option, template)
            createOption(radioTemplate, itemBody)
        })
    }

    const setAdditionalWorks = (e = null) => {
        const printTypeValue = getPrintTypeValue()
        const target = e ? e.target : null
        const options = configuration[configuration.length - 1]
        const optionList = options.options
        const itemBody = getItemBody(additionalWorks)

        clearItemBody(itemBody)

        let material
        let type

        if (target && target.closest(".item__input_radio")) {
            const materialValue = getMaterialValue()
            warning.style.display = ""
            const checkedMaterial = checkMaterial(materialValue)
            material = checkedMaterial.material
            type = checkedMaterial.type ? checkedMaterial.type : null
        }

        optionList.forEach((option) => {
            if (
                type &&
                option.forMaterial.indexOf(material) > -1 &&
                option.typeExceptions.indexOf(type) === -1 &&
                option.titleExceptions.indexOf(printTypeValue) === -1
            ) {
                const template = additionalWorksRadioTemplate(option)
                createOption(template, itemBody)
            }
            if (
                !type &&
                option.forMaterial.indexOf(material) > -1 &&
                option.titleExceptions.indexOf(printTypeValue) === -1
            ) {
                const template = additionalWorksRadioTemplate(option)
                createOption(template, itemBody)
            }
            if (!material) {
                const template = additionalWorksRadioTemplate(option)
                createOption(template, itemBody)
            }
        })
    }

    const setResultTextContent = (elem, text) => (elem.querySelector("#result").textContent = text)

    const setResultHTML = (title) => {
        addWorks.insertAdjacentHTML(
            "beforeend",
            `<li class="calc__row calc__row_result"><p class="result-text" id="text">${title}</p></li>`
        )
    }

    const createOption = (template, itemBody) => {
        itemBody.insertAdjacentHTML("beforeend", template)
    }

    const clearItemBody = (itemBody) => {
        itemBody.innerHTML = ""
    }

    const renderResult = (
        printTypeText = null,
        sizeText = null,
        countText = null,
        materialText = null,
        addWorksTitles,
        result = null,
        resultOne = null
    ) => {
        setResultTextContent(printTypeResult, printTypeText)
        setResultTextContent(sizeResult, sizeText)
        setResultTextContent(countResult, countText)
        setResultTextContent(materialResult, materialText)

        if (addWorksTitles && addWorksTitles.length) {
            addWorks.innerHTML = ""
            addWorksTitles.forEach((title) => {
                setResultHTML(title)
            })
        } else {
            addWorks.innerHTML = ""
        }

        setResultTextContent(mainResult, result)
        setResultTextContent(mainOneResult, resultOne)
        price.textContent = result
        priceOne.textContent = resultOne
    }

    const perimeterCalculate = (price, perimeter) => {
        const summ = Math.ceil(price * perimeter)
        return summ
    }
    const grommetCalculate = (price, perimeter) => Math.ceil(price * (perimeter / 0.3))
    const squareCalculate = (price, square) => {
        const summ = Math.ceil(price * square)
        return summ
    }

    const calculate = () => {
        const printTypeValue = getPrintTypeValue()

        const width = getNumberData("size__weight")
        if (!checkParameterExistence(width, warningWidth())) {
            renderResult()
            return
        }

        const height = getNumberData("size__height")
        if (!checkParameterExistence(height, warningHeight())) {
            renderResult()
            return
        }

        const count = getNumberData("count__value")
        if (!checkParameterExistence(count, warningCount())) {
            renderResult()
            return
        }

        const materialValue = getMaterialValue()
        if (!checkParameterExistence(materialValue, warningMaterials())) {
            renderResult()
            return
        }

        const checkedMaterial = checkMaterial(materialValue)

        const prices = checkedMaterial.prices

        const elemPerimeter = ((width + height) * 2) / 1e3

        const elemSquare = (width * height) / 1e6

        const elemsPerimeter = elemPerimeter * count

        const elemsSquare = elemSquare * count
        if (!checkParameterValue(elemsSquare, warningSquare(elemsSquare))) {
            renderResult()
            return
        }

        const cost = getElemCost(elemsSquare, prices)

        const selectedAddWorks = getSelectedAddWorks()

        const addWorksOptions = getAddWorksOptions(selectedAddWorks)

        const addWorksTitles = addWorksOptions.map((option) => option.title)

        const addWorkPrice = addWorksOptions.reduce((sum, option) => {
            let price
            switch (option.value) {
                case "1":
                    price = perimeterCalculate(option.price, elemsPerimeter)
                    break
                case "2":
                    price = perimeterCalculate(option.price, elemsPerimeter)
                    break
                case "3":
                    price = perimeterCalculate(option.price, elemsPerimeter)
                    break
                case "4":
                    price = grommetCalculate(option.price, elemsPerimeter)
                    break
                case "5":
                    price = squareCalculate(option.price, elemsSquare)
                    break
                case "6":
                    price = squareCalculate(option.price, elemsSquare)
                    break
                case "7":
                    price = squareCalculate(option.price, elemsSquare)
                    break
            }
            return sum + price
        }, 0)

        const result = (elemsSquare * cost + addWorkPrice).toFixed(2)
        const resultOne = (result / count).toFixed(2)

        renderResult(
            printTypeValue,
            `${elemsSquare.toFixed(2)} кв.м.`,
            `${count} шт.`,
            materialTemplate(checkedMaterial),
            addWorksTitles,
            result,
            resultOne
        )
    }

    const reset = () => {
        document.querySelector(".item__input_radio:checked").checked = false
        document.getElementById("size__weight").value = ""
        document.getElementById("size__height").value = ""
        document.getElementById("count__value").value = ""
        document.querySelectorAll(".item__input_checkbox:checked").forEach((elem) => {
            elem.checked = false
        })
        renderResult()
    }

    printTypeSelect.addEventListener("change", setMaterialOptions)
    material.addEventListener("click", setAdditionalWorks)
    resetBtn.addEventListener("click", reset)
    calcBtn.addEventListener("click", calculate)

    setMaterialOptions(null, getPrintTypeValue())
    setAdditionalWorks()
})
