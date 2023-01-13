window.addEventListener('DOMContentLoaded' , () => {

    // Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');
        

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide')
            item.classList.remove('show' , 'fade')
        })

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active')
        })
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show' , 'fade')
        tabsContent[i].classList.remove('hide')
        tabs[i].classList.add('tabheader__item_active')
    }

    hideTabContent()
    showTabContent()

    tabsParent.addEventListener('click' , (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item , i) => {
                if(target == item) {
                    hideTabContent()
                    showTabContent(i)
                }
            })
        }
    })


    
    // Timer

    const deadLine = '2022-09-14'

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(t / (1000 * 60 * 60 *24)),
              hours = Math.floor((t / (1000 * 60 * 60) % 24)),
              minutes = Math.floor((t / 1000 / 60) % 60),
              seconds = Math.floor((t / 1000) % 60);        

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        }
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return`0${num}`
        } else {
            return num
        }
    }

    function setClock(selector , endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock , 1000)

        updateClock()

        function updateClock() {
            const t = getTimeRemaining(endtime)

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval)
            }
        } 
    }
    setClock('.timer' , deadLine)
    
        

// Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal')

    function openModal() {
        modal.classList.add('show')
        modal.classList.remove('hide')
        document.body.style.overflow = 'hidden'
        clearInterval(modalTimerId)
    }    
    modalTrigger.forEach(btn => {
        btn.addEventListener('click' , openModal)
    })

    function closeModal() {
        modal.classList.add('hide')
        modal.classList.remove('show')
        document.body.style.overflow = ''
    }    
    
    modal.addEventListener('click' , (event) => {
        if (event.target === modal || event.target.getAttribute('data-close') == '') {
            closeModal()
        }
    }) 

    document.addEventListener('keydown' , (event) => {
        if (event.code === 'Escape' && modal.classList.contains('show')) {
            closeModal()
        }
    })

    const modalTimerId = setTimeout(openModal , 30000)
    
    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal()
            window.removeEventListener('scroll' , showModalByScroll)
        }
    }
    window.addEventListener('scroll' , showModalByScroll)




    // Classes for cards

    class MenuCard {
        constructor(src , alt , title , descr , price , parentSelector , ...classes) {
            this.srca = src
            this.alt = alt
            this.title = title
            this.descr = descr
            this.price = price
            this.classes = classes
            this.parent = document.querySelector(parentSelector)
            this.transfer = 27
            this.changeToUAH()
        }
        
        changeToUAH() {
            this.price = this.price * this.transfer
        }

        render() {
            const element = document.createElement('div')
            
            if (this.classes.length === 0) {
                this.element = 'menu__item'
                element.classList.add(this.element)
            } else {
                this.classes.forEach(className => element.classList.add(className))
            }
           
            element.innerHTML = `          
            <img src=${this.srca} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total">${this.price} грн/день</div>
            </div>            
            `
            this.parent.append(element)       
        }
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container',
    ).render()


    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        13,
        '.menu .container',
    ).render()


    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        10,
        '.menu .container',        
    ).render()




    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/054 spinner.svg',
        succes: 'Mersi',
        fail: 'dea pula'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type' : 'application/json'
            },
            body: data
        })

        return await res.json()
    }

    function bindPostData(form) {
        form.addEventListener('submit' , (event) => {
            event.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `
            form.insertAdjacentElement('afterend' , statusMessage)

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()))  
             // entries возвращает массив из обьекта

            

            postData('http://localhost:3000/requests', json) //JSON.stringify(object))
            .then(data1 => {
                console.log(data1)
                showThanksModal(message.succes) 
                statusMessage.remove()
            }).catch(() => { 
                showThanksModal(message.fail)
            }).finally(() => {
                form.reset()
            })
        });
    }
    
    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog')

        prevModalDialog.classList.add('hide')
        openModal()

        const thanksModal = document.createElement('div')
        thanksModal.classList.add('modal__dialog')
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>x</div>
            <div class="modal__title">${message}</div>
        </div>
        `

        document.querySelector('.modal').append(thanksModal)
        setTimeout(() => {
            thanksModal.remove()
            prevModalDialog.classList.add('show')
            prevModalDialog.classList.remove('hide')
            closeModal()
        }, 4000)
    }


    fetch('http://localhost:3000/menu')
        .then(result => result.json())
        .then(rez => console.log(rez))



    

   // Slide


    const slides = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider')
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(slidesWrapper).width;

          console.log(width)

    let sliderIndex = 1
    let offset = 0

    if(slides.length < 10) {
        total.textContent = `0${slides.length}`
        current.textContent = `0${sliderIndex}`
    } else {
        total.textContent = slides.length
        current.textContent = sliderIndex
    }

    slidesField.style.width = 100 * slides.length + '%'
    slidesField.style.display = 'flex'
    slidesField.style.transition = '0.5s all'
    
    slidesWrapper.style.overflow = 'hidden'

    slides.forEach(slide => {
        slide.style.width = width
    })

    slider.style.position = 'relative'

    const indicators = document.createElement('ol'),
          dots = []

    indicators.classList.add('carousel-indicators')
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `
    slider.append(indicators)

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li')
        dot.setAttribute('data-slide-to' , i+1)
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `
        if(i == 0) {
            dot.style.opacity = 1
        }
        indicators.append(dot)
        dots.push(dot)
    }

    next.addEventListener('click' , () => {
        if(offset == +width.slice(0 , width.length - 2) * (slides.length - 1)) {
            offset = 0
        } else {
            offset += +width.slice(0 , width.length - 2)
        }

        slidesField.style.transform = `translateX(-${offset}px)`

        if(sliderIndex == slides.length) {
            sliderIndex = 1
        } else {
            sliderIndex++
        }

        placeCurrentLenght()
        placeDotsOpacity()
    })


    prev.addEventListener('click' , () => {
        if(offset == 0) {
            offset = +width.slice(0 , width.length - 2) * (slides.length - 1)
        } else {
            offset -= +width.slice(0 , width.length - 2)
        }

        slidesField.style.transform = `translateX(-${offset}px)`

        if(sliderIndex == 1) {
            sliderIndex = slides.length
        } else {
            sliderIndex--
        }

        placeCurrentLenght()
        placeDotsOpacity()
    })

    dots.forEach(dot => {
        dot.addEventListener('click' , (event) => {
            const slideTo = event.target.getAttribute('data-slide-to')

            sliderIndex = slideTo
            offset = +width.slice(0 , width.length - 2) * (slideTo - 1)

            slidesField.style.transform = `translateX(-${offset}px)`

            placeCurrentLenght()
            placeDotsOpacity()
        })
    })

    function placeCurrentLenght() {
        if(slides.length < 10) {
            current.textContent = `0${sliderIndex}`
        } else {
            current.textContent = sliderIndex
        }
    }

    function placeDotsOpacity() {
        dots.forEach(dot => dot.style.opacity = '.5')
        dots[sliderIndex - 1].style.opacity = 1
    }




});