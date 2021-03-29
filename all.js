console.clear();

let data = [];
axios.get("https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json")
    .then(function(response) {
        data = response.data;
        renderList(data);
        setC3(data);
    });


//ticketCard資料渲染
const ticketCardArea = document.querySelector('.ticketCard-area')

function renderList(arr) {
    ticketCardArea.innerHTML = ''
    arr.forEach(function(i) {
        ticketCardArea.innerHTML += `
        <li class="ticketCard">
        <div class="ticketCard-img">
        <a href="#"><img src="${i.imgUrl}" alt=""></a></div>
        <div class="ticketcardRegion">${i.area}</div>
        <div class="ticketcardStar">${i.rate}</div>
        <div class="ticketcard-content">
            <div>
                <h3 class="ticketcard-name">${i.name}</h3>
                <p class="ticketcard-description">${i.description}</p>
            </div>
            <div class="ticketcard-detail">
                <p class="ticketcard-last"><i class="fas fa-exclamation-circle"></i>剩下最後<span>${i.group}</span>組</p>
                <p class="ticketcard-price"><span class="ticketcard-twd">TWD</span>$${i.price}</p>
            </div>
        </div>
    </li>`
    })
}

//串入C3圖表

let c3Data = [];

function renderAreaList(arr) {
    let areaTotalData = {};
    arr.forEach(function(item, index) {
        if (areaTotalData[item.area] == undefined) {
            areaTotalData[item.area] = 1;
        } else {
            areaTotalData[item.area] += 1;
        }
    });

    let area = Object.keys(areaTotalData);
    c3Data = [];
    area.forEach(function(item, index) {
        let ary = [];
        ary.push(item);
        ary.push(areaTotalData[item]);
        c3Data.push(ary);
    });

}

//C3圖表設定
function renderC3() {
    const chart = c3.generate({
        bindto: "#chart",
        data: {
            columns: c3Data,
            type: "donut"
        },
        donut: {
            title: "套票地區比重",
            width: 10,
            label: {
                show: false
            }
        },
        size: {
            height: 180,
            width: 180
        },
        color: {
            pattern: ['#26C0C7', '#5151D3', '#E68618']
        }
    });
}

function setC3(arr) {
    renderAreaList(arr)
    renderC3()
}

//新增資料
const ticketName = document.querySelector('#ticketName')
const imgUrl = document.querySelector('#imgUrl')
const region = document.querySelector('#region')
const ticketPrice = document.querySelector('#ticketPrice')
const ticketNum = document.querySelector('#ticketNum')
const ticketStar = document.querySelector('#ticketStar')
const ticketDescription = document.querySelector('#ticketDescription')
const addButton = document.querySelector('.addButton')
const form = document.querySelector('.addTicket-form')

addButton.addEventListener('click', function(e) {
    e.preventDefault;
    let empty = [region, ticketDescription, ticketNum, imgUrl, ticketName, ticketPrice, ticketStar].some(i => i.value == '')
    if (empty) {
        alert('請將資料填寫完整')
        return
    }

    data.push({
        area: region.value,
        description: ticketDescription.value,
        group: ticketNum.value,
        imgUrl: imgUrl.value,
        name: ticketName.value,
        price: ticketPrice.value,
        rate: ticketStar.value,
        id: data.length
    })
    renderList(data)
    form.reset()
    setC3(data)


})

//地區篩選
const regionSearch = document.querySelector('#regionSearch')
const searchNum = document.querySelector('.searchNum')

regionSearch.addEventListener('change', function(e) {
    let newData = data.filter(function(i) {
        if (e.target.value == "") {
            return i
        } else if (e.target.value == i.area) {
            return i
        }
    })
    renderList(newData)
    searchNum.textContent = `本次搜尋共 ${newData.length} 筆資料`
})