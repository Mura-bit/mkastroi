const caart = () => {
    const cartBtn = document.querySelector('.button-cart') // кнопка для активации модального окна
    const cart = document.getElementById('modal-cart') // Модальное окно
    const closeBtn = cart.querySelector('.modal-close') // кнопка закрытия модального окна
    const goodsContainer = document.querySelector('.long-goods-list') // Окно с товарами
    const cartTable = document.querySelector('.cart-table__goods') // Окно корзины
    const modalForm = document.querySelector('.modal-form') // Форма в модальном окне
    const totalPriceEl = document.querySelector('.card-table__total') // Сумма все корзины

    const formInputName = document.querySelector('[name="nameCustomer"]') // input имени из модальной формы
    const formInputPhone = document.querySelector('[name="phoneCustomer"]') // input телефона из модальной формы

    // функция удаление товара из корзины
    const deleteCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))
        const newCart = cart.filter(good => {
            return good.id !== id
        })
        localStorage.setItem('cart', JSON.stringify(newCart))
        renderCartGoods(JSON.parse(localStorage.getItem('cart')))
    }
    const plusCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))
        const newCart = cart.map(good => {
            if(good.id === id) {
                good.count++
            }
            return good
        })

        localStorage.setItem('cart', JSON.stringify(newCart))
        renderCartGoods(JSON.parse(localStorage.getItem('cart')))
    }
    const minusCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))
        const newCart = cart.map(good => {
            if(good.id === id) {
                if(good.count > 0) {
                    good.count--
                }
            }
            return good
        })

        localStorage.setItem('cart', JSON.stringify(newCart))
        renderCartGoods(JSON.parse(localStorage.getItem('cart')))
    }

    const addToCart = (id) => {
        const goods = JSON.parse(localStorage.getItem('goods')) // база с товарами
        const clickedGood = goods.find(good => good.id === id) // id товара
        const cart = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : []
        
        if(cart.some(good => good.id === clickedGood.id)) {
            cart.map(good => {
                if(good.id === clickedGood.id) {
                    good.count++
                }
                return good
            })
        } else {
            clickedGood.count = 1
            cart.push(clickedGood)
        }

        // Готовая база товара в корзине
        localStorage.setItem('cart', JSON.stringify(cart))
    }

    // Отписовка товара в корзине
    const renderCartGoods = (goods) => {
        cartTable.innerHTML = ''
        goods.forEach(good => {
            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${good.name}</td>
                <td>${good.price}KGS</td>
                <td><button class="cart-btn-minus">-</button></td>
                <td>${good.count}</td>
                <td><button class="cart-btn-plus">+</button></td>
                <td>${+good.price * +good.count}KGS</td>
                <td><button class="cart-btn-delete">x</button></td>
            `
            cartTable.append(tr)
            
            // Оживляем кнопки корзины
            tr.addEventListener('click', (e) => {
                if (e.target.classList.contains('cart-btn-minus')) {
                    minusCartItem(good.id)
                } else if (e.target.classList.contains('cart-btn-plus')) {
                    plusCartItem(good.id)
                } else if (e.target.classList.contains('cart-btn-delete')) {
                    deleteCartItem(good.id)
                }
            })
        })
        // функция посчета суммы корзины
        let totalPrice = 0
        goods.forEach((item) => {
            const priceEl = item.price * item.count
            console.log(priceEl);
            totalPrice += priceEl
            console.log(totalPrice);
        })
        totalPriceEl.innerText = totalPrice + 'KGS'
    }

    const sendForm  = (nameInput, phoneInput) => {
        const cartArray = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : []

        fetch('https://jsonplaceholder.typicode.com/posts', {   
            method: 'POST',
            body: JSON.stringify({
                cart: cartArray,
                name: nameInput,
                phone: phoneInput,
            })
        }).then(() => {
            nameInput.value = ''
            phoneInput.value = ''

            cart.style.display = ''
            localStorage.removeItem('cart')
            cart.style.display = ''
        })
    }

    modalForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const nameInput = formInputName.value
        const phoneInput = formInputPhone.value
        
        sendForm(nameInput, phoneInput)
    })

    // функция вызова модального окна
    cartBtn.addEventListener('click', () => {
        const cartArray = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : []

        renderCartGoods(cartArray)
        cart.style.display = 'flex'
    })

    closeBtn.addEventListener('click', () => {
        cart.style.display = ''
    })

    // функция закрытия модального окна
    cart.addEventListener('click', (event) => {
        if (!event.target.closest('modal') && event.target.classList.contains('overlay')) {
            cart.style.display = ''
        }
    })

    if (goodsContainer) {
        goodsContainer.addEventListener('click', (event) => {
            if (event.target.closest('.add-to-cart')) {
                const buttonToCart = event.target.closest('.add-to-cart')
                const goodId = buttonToCart.dataset.id
                addToCart(goodId)
            }
        })
    }
}

caart()