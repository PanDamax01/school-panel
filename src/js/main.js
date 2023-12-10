let body,formLogin,alertModal,inputs,rootCSS,app,burgerLines,burgerLine2,sidebar,navbar,sidebarSpans,sidebarItems,prev,formEditItems,btnSendForm,dialog,boxesForm,dialogBoxBtn,dialogBoxImg,wrapperDialog,dialogBtnClose,schoolBell,hideCheckboxes,parafgraphAdvertisement
let parentDiv, idImg = 0, idRow = 0
// aktualna sekcja zmeinna let i jaka ona jest to takie wysylam dane oraz ejsli jest to nie mozna przeloczcyc karty bo bloku nie wyslane dane dane nie zsotaly wysalne

const api = {
    log: 'https://api.pqwouriqwuo.ct8.pl/api/Account/Authorize',
    refreshToken: 'https://api.pqwouriqwuo.ct8.pl/api/Account/RefreshToken',
    postDatabase: 'https://api.pqwouriqwuo.ct8.pl/api',
}

const settings = {
    maxLengthEvent: 30,
    maxLengthTextarea: 340,
}

// jak pobieram dane to musze je tutaj wsadzic i zwiekc id-row i id-li
let newData = {
    naglowek: { logo: 'logo-svhool.png', event: '' },
    klasy: { hide: false, files: '' },
    slider: { hide: false, slider: [] },
    ogloszenia: { hide: false, text: '', poster: '' },
    zastepstwa: { hide: false, tablica: [] },
}

const main = () => {
    prepareDOMElements()
	prepareDOMEvents()
    window.addEventListener('load', checkLoading)
}

const prepareDOMElements = () => {
    body = document.querySelector('body')
    rootCSS = document.documentElement
    formLogin = body.querySelector('.login__form')
    inputs = [...formLogin.querySelectorAll('input')]
    app = body.querySelector('.app')
    alertModal = body.querySelector('.modal__alert')
    burgerLines = [body.querySelector('.line1'), body.querySelector('.line3')]
  	burgerLine2 = body.querySelector('.line2')
  	sidebar = body.querySelector('.sidebar')
  	navbar = body.querySelector('.navbar')
  	sidebarSpans = [...body.querySelectorAll('.sidebar__text')]
  	sidebarItems = [...body.querySelectorAll('.sidebar__item')]
    prev = [...body.querySelectorAll('.prev')]
    formEditItems = [...body.querySelectorAll('.edit__item')]
  	btnSendForm = body.querySelector('.edit__btn--send')
  	wrapperDialog = body.querySelector('.edit__wrapper')
  	dialog = body.querySelector('.edit__dialog')
  	dialogBoxBtn = body.querySelector('.edit__box-btn')
  	dialogBoxImg = body.querySelector('.edit__box-img')
  	dialogBtnClose = body.querySelector('.edit__btn-close')
    boxesForm = [...body.querySelectorAll('.edit__box-from')]
    schoolBell = body.querySelector('.school__bell')
    hideCheckboxes = body.querySelectorAll('.edit__checkmark')
    parafgraphAdvertisement = document.querySelector('.main__text')

    // console.log(boxesForm);
}

const prepareDOMEvents = () => {
    onStartWebsite()
    burgerLine2.closest('svg').addEventListener('click', toogleNav)
    sidebarItems.forEach((el, index) => el.addEventListener('click', e => changeCategory(e, index)))
    boxesForm.forEach((el, index) => el.addEventListener('click', e => deletePrevientDefault(e, index)))
    dialogBoxImg.addEventListener('click', e => selectFormImg(e))
    hideCheckboxes.forEach((el, index) => el.addEventListener('click', e => hideElementOnView(e, index)))
}

const currentDate = () => new Date()

const onStartWebsite = () => {
    setThemeLogin()
    if (window.innerWidth > 992) openNav()
}

const setThemeLogin = () => {
    // poprawic nie wszytkie daty sprawdza
    const month = currentDate().getMonth()
    const day = currentDate().getDate()

    const isWinter = (month >= 0 && month <= 2) && (day < 21)
    const isSpring = (month >= 3 && month <= 5) && (day < 22)
    const isSummer = (month >= 6 && month <= 8) && (day < 23)
    const isAutumn = (month >= 9 && month <= 11)

    // ;[isWinter, isSpring, isSummer, isAutumn].some((el, index) => el === true ? i = index : null)
    let i = [isWinter, isSpring, isSummer, isAutumn].findIndex((el) => el === true);

    const colors = ['210', '122', '300', '14']
    rootCSS.style.setProperty('--login-color', colors[i])
    body.querySelector('.login').style.backgroundImage = `url("dist/img/bacground-login${i}.png")`
}


const checkLoading = () => {
    const images = body.querySelectorAll('img');
    for (const image of images) {
        if (!image.complete) return
    }
    body.querySelector('.loader').classList.add('none')
}

// // ---   nav button
const toogleNav = () => {
    if (window.innerWidth < 992) body.classList.toggle('hidden')
    openNav()

}

const openNav = () => {
    burgerLines.forEach(el => el.classList.toggle('draw-line'))
	burgerLine2.classList.toggle('submitted-line')
    ;[sidebar, ...sidebarSpans, app, navbar].forEach(el => el.classList.toggle('active'))
}

// ---   Login
const checkLogin = e => {
    e.preventDefault()
    if (!navigator.onLine) return showAlert('Brak połączenia z internetem!', false)
    const values = inputs.map(input => input.value)
    if(values[2] !== '') return    

    let alert = ''
    if (!values[0].length && !values[1].length) {
        alert = 'Wprowadź dane!'
    }else if (!values[0].length && values[1].length) {
        alert = 'Wprowadź login!'
    }else if (values[0].length && !values[1].length) {
        alert = 'Wprowadź hasło!'
    }
    alert !== '' ? showAlert(alert, false) : sendLogin(e.target, values)
}

const openApp = ({ message, ok }) => {
    showAlert('Pomyślne zalogowano', ok)
    document.cookie = `access_token=${message.access_token}; expires=${message.expirens_time}; path=/`
    setTimeout(refreshToken(message.refresh_token), message.expirens_time)

    document.querySelector('.login').classList.add('none')
    app.classList.remove('none')
}

const refreshToken = async (reToken) => {
    const response = await fetch(api.refreshToken, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: reToken }),
      })
}
// access_token: "D1stwu8I9G2CQUQyiDGK6mVI1Fgtpb5QZHrQo7FOrxNsR4FhuJajINIplgMbEwEmFFw5vCsqnYW91MPu"
// actual_datetime: "2023-11-30 21:58:56"
// datetime_expirens: "2023-11-30 22:43:56"
// expirens_time:1701384236
// refresh_token: "2zbMkEBuN82wNBVQTgD21QGYKKULNl7Tx15bhG3CQ2BQsAkIM1Xia3BoFhaWVi48C0ca91egH9fRqIkJUG1oml2W0GE80tfReRW9HqvQLrusTc4X9PEs2lztQZzxDxS3Nz"


//zhenias

const sendLogin = async (e, [log, pass]) => {
    e.disabled = true
    e.classList.add('loading')
  
    try {
      const response = await fetch(api.log, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: log, password: pass }),
      })
  
      const data = await response.json()
      if (data.ok) {
          openApp(data)
      }else{
        showAlert(data.message, false)
      }
    } catch (error) {
      showAlert(error, false)
    } finally {
      e.disabled = false
      e.classList.remove('loading')
    }
}



const showAlert = (text, state) => {
	alertModal.classList.add('scroll-down')
	alertModal.textContent = text
	alertModal.style.backgroundColor = state ? 'green' : 'red'
	setTimeout(() => alertModal.classList.remove('scroll-down'), 1400)
}

const showPassword = el => {
    document.querySelector('.login__pass').textContent = el ? '🙈':'👀'
    inputs[1].type = el ? 'text' : 'password'
}

// --- edit Form
const changeCategory = (el ,index) => {
    body.querySelector('.edit__welcome').classList.add('none')
    closeImgDialog(false)
    sidebarItems.forEach((el, i) => el.classList.toggle('active', i === index))
    prev.forEach((el, i) => el.classList.toggle('none', i !== index))
    formEditItems.forEach((el, i) => el.classList.toggle('none', i !== index))
    prev.forEach((el, i) => el.classList.toggle('transform-down', i === index))
    formEditItems.forEach((el, i) => el.classList.toggle('transform-down', i === index))
    btnSendForm.classList.remove('none')
    
    index === 5 ? openDialog() : closeDialog()

//     divHidden.classList.toggle('none', !prev[index].classList.contains('hide-now'))
}

const openDialog = () => {
    btnSendForm.classList.add('none')
    dialog.classList.remove('none')
    dialog.classList.add('transform-down')
    dialogBtnClose.classList.add('none')
}
const closeDialog = () => {
    dialog.classList.add('none')
    dialog.classList.remove('transform-down')
    dialogBtnClose.classList.remove('none')
}


// --- edit form categories
const deletePrevientDefault = (e, index) => {
    if (index === 3) return
    e.preventDefault()
}

const showImgDialog = e => {
    parentDiv = e.target.closest('div')
    wrapperDialog.classList.add('wrapper-form')
    dialog.classList.add('show-dialog')
    dialogBoxBtn.classList.add('none')
    dialogBoxImg.style.height = '78vh'
    dialog.classList.add('active')
}

const closeImgDialog = e => {
    e ? e.preventDefault() :  null
    wrapperDialog.classList.remove('wrapper-form')
    dialog.classList.remove('show-dialog')
    dialogBoxBtn.classList.remove('none')
    dialogBoxImg.style.maxHeight = ''
    dialog.classList.remove('active')
}

const selectFormImg = e => {
    if (e.target !== dialogBoxImg && dialog.classList.contains('active')) {
        const buttons = [...parentDiv.querySelectorAll('button')]
        buttons.forEach(el => el.classList.toggle('none'))

        const span = document.createElement('span')
        span.textContent = e.target.src.split('/').pop()
        parentDiv.appendChild(span)

        updateCurrentPhotos(e.target.src.split('/').pop(), parentDiv)
        closeImgDialog(false)
    }
}
// -- setup img
const updateCurrentPhotos = (imgSrc, parentDiv) => {
    const className = parentDiv.parentElement.closest('div').className
    const parentImg = body.querySelector(`.${className}`)

    if (parentDiv.classList.contains('logo-school')) {
        body.querySelector('.school__logo').src = `dist/img/${imgSrc}`
        newData.naglowek.logo = imgSrc
    } else if(parentDiv.classList.contains('gallery-school')){
        parentImg.querySelector('img').src = `dist/img/${imgSrc}`
        newData.slider.slider.push({imgSrc, className})
    }else if(parentDiv.classList.contains('news-poster')){
        parafgraphAdvertisement.style.backgroundImage = `url('dist/img/${imgSrc}')`
        parafgraphAdvertisement.style.color = 'transparent'
        newData.ogloszenia.poster = imgSrc
    }
}

const closeLogoImg = e => {
    body.querySelector('.school__logo').src = `dist/img/logo-svhool.png`
    const buttons = [...e.target.closest('div').querySelectorAll('button')]
    buttons.forEach(el => el.classList.toggle('none'))
    e.target.closest('div').querySelector('span').remove()
    newData.naglowek.logo = 'logo-svhool.png'
}
const addNewEvent = e => {
    const inputValue = e.target.closest('div').querySelector('input').value
    if (inputValue.length === 0) return showAlert('Nic nie wprowadziłeś', false)
    schoolBell.textContent = inputValue.slice(0, settings.maxLengthEvent)
    schoolBell.style.backgroundColor = 'green'
    newData.naglowek.event = inputValue
}
const closeNewEvent = e => {
    e.target.closest('div').querySelector('input').value = ''

    schoolBell.textContent = 'Do końca '
    const subjectSpan = document.createElement('span')
    const timerSpan = document.createElement('span')
    subjectSpan.className = 'school__subject'
    timerSpan.className = 'school__timer'
    subjectSpan.textContent = 'lekcji 9'
    timerSpan.textContent = '99min'
    schoolBell.appendChild(subjectSpan)
    schoolBell.appendChild(document.createTextNode(' - '))
    schoolBell.appendChild(timerSpan)
    schoolBell.style.backgroundColor = ''
    newData.naglowek.event = ''
}

const hideElementOnView = (e, index) => {
    e.target.classList.toggle('active')
    prev[index+1].classList.toggle('active')
    switch (index + 1) {
        case 1:
            return newData.klasy.hide = !newData.klasy.hide
        case 2:
            return newData.slider.hide = !newData.slider.hide
        case 3:
            return newData.ogloszenia.hide = !newData.ogloszenia.hide
        case 4:
            return newData.zastepstwa.hide = !newData.zastepstwa.hide
    }
}

const closeItemGallery = e => {
    const className = e.target.closest('div').parentElement.closest('div').className
    const items = body.querySelectorAll(`.${className}`)
    items.forEach(el => el.remove())
    newData.slider.slider = newData.slider.slider.filter(item => item.className !== className)

}

const updateCurrentTextarea = e => {
    const textareaValue = e.target.closest('div').querySelector('textarea').value
    if (textareaValue === '') return showAlert('Nic nie wprowadziłeś', false)
    const currentTextareaValue = textareaValue.length < settings.maxLengthTextarea ? textareaValue : textareaValue
    .slice(0, settings.maxLengthTextarea) + '...'
    document.querySelector('.main__text').textContent = currentTextareaValue
    newData.ogloszenia.text = currentTextareaValue
}
const deleteTeaxarea = e => {
    e.target.closest('div').querySelector('textarea').value = ''
    parafgraphAdvertisement.textContent = ''
    newData.ogloszenia.text = ''
}
const deleteImgPoster = e => {
    parafgraphAdvertisement.style.backgroundImage = ``
    parafgraphAdvertisement.style.color = ''
    const buttons = [...e.target.closest('div').querySelectorAll('button')]
    buttons.forEach(el => el.classList.toggle('none'))
    e.target.closest('div').querySelector('span').remove()
    newData.ogloszenia.poster = ''
}

const editSubsitRow = e => {
    const className = e.target.closest('div').className.split(' ')[1]
    const rowTable = body.querySelector(`.${className}`)
    const cellsTable = [...rowTable.querySelectorAll('td')]

    const trForm = e.target.closest('div').querySelector('tr')
    const inputs = [...trForm.querySelectorAll('input')]

    if (inputs.some(el => el.value === '')) return showAlert('Uzupełnij wszystkie pola', false)
    inputs.forEach((input, index) => {
        cellsTable[index].textContent = input.value
    })

    const inputsValue = inputs.map(el => el.value)
    newData.zastepstwa.tablica.push(inputsValue)
}
const deleteSubsitRow = e => {
    const className = e.target.closest('div').className.split(' ')[1]
    const items = body.querySelectorAll(`.${className}`)
    items.forEach(el => el.remove())
    newData.zastepstwa.tablica = newData.zastepstwa.tablica.filter(item => item.className !== className);
}

// add new section
const addNewLiImg = e => {
    e.preventDefault()
    idImg++
    const div = document.createElement('div')
    div.className = `li-${idImg}`
    div.innerHTML = `
            <span class="edit__label">Zdjęcie</span>
            <div class="edit__box-image gallery-school">
                <button class="edit__btn-img check" onclick="showImgDialog(event)">Wybierz zdjęcie</button>
                <button class="edit__btn-form edit__btn-form--delete none" onclick="closeItemGallery(event)"></button>
            </div>`
    body.querySelector('.list-img').appendChild(div)

    const li = document.createElement('li')
    li.className = `main__card li-${idImg}`
    li.innerHTML = `
    <img src="dist/img/addImg.png" alt="Picture" class="main__img">`
    body.querySelector('.main__carousel').appendChild(li)
}

const addNewDivRow = e => {
    e.preventDefault()
    idRow++
    const div = document.createElement('div')
    div.className = `edit__box-from row-${idRow}`
    div.innerHTML = `
        <span class="edit__label">Kolumna</span>
        <div class="edit__box--table">
            <table>
                <tbody><tr class="subsit__row">
                    <td class="subsit__cell"><input type="text" name="ok" class="edit__input short"></td>
                    <td class="subsit__cell"><input type="text" name="ok" class="edit__input long"></td>
                    <td class="subsit__cell"><input type="text" name="ok" class="edit__input mid"></td>
                    <td class="subsit__cell"><input type="text" name="ok" class="edit__input long"></td>
                    <td class="subsit__cell"><input type="text" name="ok" class="edit__input mid"></td>
                    <td class="subsit__cell"><input type="text" name="ok" class="edit__input long"></td>
                    <td class="subsit__cell"><input type="text" name="ok" class="edit__input long"></td>
                </tr>
            </tbody></table>
        </div>
        <button class="edit__btn-form edit__btn-form--check write" onclick="editSubsitRow(event)"></button>
        <button class="edit__btn-form edit__btn-form--delete write" onclick="deleteSubsitRow(event)"></button>`
        body.querySelector('.list-li').appendChild(div)

    const tr = document.createElement('tr')
    tr.className = `subsit__row row-${idRow}`
    tr.innerHTML = `
        <td class="subsit__cell">---</td>
        <td class="subsit__cell">---</td>
        <td class="subsit__cell">---</td>
        <td class="subsit__cell">---</td>
        <td class="subsit__cell">---</td>
        <td class="subsit__cell">---</td>
        <td class="subsit__cell">---</td>`
    body.querySelector('.subsit__tbody').appendChild(tr)

}




// send edit date to serwer
const sendEditDateToServer = e => {
    e.preventDefault()

    const activeItem = sidebarItems.find(el => el.classList.contains('active')).textContent.trim()
    const dateToSend = createTaskData(activeItem)
    sendDateToServer(dateToSend, e.target, dateToSend.method)
}

const createTaskData = nameActiveTask => {
    const sliderUrls = newData.slider.slider.map(item => item.imgSrc)

    switch (nameActiveTask) {
        case 'Nagłówek':
            return {name: 'naglowek', logo: newData.naglowek.logo, event: newData.naglowek.event, method: 'Settings/Edit' }
        case 'Klasy':
            return {name: 'klasy', hide: newData.klasy.hide, files: newData.naglowek.event }
        case 'Slider':
            return {name: 'slider', hide: newData.slider.hide, images: sliderUrls }
        case 'Ogłoszenia':
            return {name: 'ogloszenia', hide: newData.ogloszenia.hide, text: newData.ogloszenia.text, poster: newData.ogloszenia.poster, 
            method: 'Announcements/Create'}
        case 'Zastepstwa':
            return {name: 'zastepstwa', hide: newData.zastepstwa.hide, tablica: newData.zastepstwa.tablica }
    
        default:
            return null
    }
}

const sendDateToServer = async (data, button, method) => {
    button.disabled = true
    button.classList.add('loading')

    data.access_token = getCookie();
    if (data === null) return
    console.log(data);
    try {
        const response = await fetch(api.postDatabase + '/' + method, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            throw new Error('Nie udało się wysłać danych na serwer')
        }

        // const resData = await response.json() //odp z serwera i komunikat
        // showAlert(resData.message, resData.id)
    } catch (error) {
        console.error('Wystąpił błąd podczas wysyłania danych:', error.message)
    } finally {
        button.disabled = false
        button.classList.remove('loading')
    }
}
























document.addEventListener('DOMContentLoaded', main)
