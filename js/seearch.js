const getGoods = () => {
    const links = document.querySelectorAll('.navigation-link') // ссылки нав. меню
    const viewAll = document.querySelectorAll('.more') // кнопка больше
    const viewMore = document.querySelector('.more')
    
    // отрисоваваем карточки 
    const renderGoods = (goods) => {
        const goodsContainer = document.querySelector('.long-goods-list') //к онтейнер для карточек

        goodsContainer.innerHTML = '' //стираем содержимое контейнера

        //макет карточки
        goods.forEach(good => {
            const goodBlock = document.createElement('div') //блок карточки

            //добавляем классы
            goodBlock.classList.add('col-lg-3')
            goodBlock.classList.add('col-sm-6')
            goodBlock.data = good
            //содержимое карточки
            goodBlock.innerHTML = `
                <div class="goods-card">
                    <span class="label ${good.label ? null : 'd-none'}">${good.label}</span>
                    <img src="db/${good.img}" alt="${good.name}" class="goods-image">
                    <h3 class="goods-title">${good.name}</h3>
                    <p class="goods-description">${good.description}</p>
                    <button class="button goods-card-btn add-to-cart" data-id="${good.id}">
                        <span class="button-price">${good.price} KGS</span>
                    </button>
                </div>
            `
            goodsContainer.append(goodBlock)
        })
    }

    const getData = (value, category) => {
        fetch('/db/db.json')
            .then((res) => res.json())
            .then((data) => {
                const array = category ? data.filter((item) => item[category] === value) : data

                localStorage.setItem('goods', JSON.stringify(array))

                if (window.location.pathname !== "/goods.html") {
                    window.location.href = '/goods.html'
                } else {
                    renderGoods(array)
                }
            })
    }

    links.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault()
            const linkValue = link.textContent
            const category = link.dataset.field

            getData(linkValue, category)
        })
    })

    viewAll.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault()

            const linkValue = link.textContent
            const category = link.dataset.field

            getData(linkValue, category)
        })
    })

    if (localStorage.getItem('goods') && window.location.pathname === "/goods.html") {
        renderGoods(JSON.parse(localStorage.getItem('goods')))
    }

    if (viewMore) {
        viewMore .addEventListener('click', (event) => {
            event.preventDefault()

            getData()
        })
    }
                     
}
getGoods()