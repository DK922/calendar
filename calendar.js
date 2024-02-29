const Calendar = document.querySelector(".calendar");

const apiUrl = 'https://api.example.com'; 
function fetchAvailableDates() {
    return fetch(apiUrl)
        .then(response => response.json())
        .catch(error => {
            console.error('Greška pri dohvaćanju dostupnih datuma:', error);
            return [];
        });
}

function markAvailableDates(availableDates) {
    const dayElements = document.querySelectorAll('.day');

    dayElements.forEach(dayElement => {
        const dateString = `${document.querySelector('.date__month').textContent.trim()} ${dayElement.textContent}`;
        const isoDateString = new Date(dateString).toISOString().split('T')[0];

        if (availableDates.includes(isoDateString)) {
            dayElement.classList.add('available');
        } else {
            dayElement.classList.add('unavailable');
        }
    });
}

// Onemogući odabir zauzetih datuma
const dayElements = document.querySelectorAll('.day');

dayElements.forEach(dayElement => {
    dayElement.addEventListener('click', () => {
        if (!dayElement.classList.contains('unavailable')) {
            bookSelectedDate(dayElement);
        } else {
            console.log('Datum je zauzet, ne može se odabrati.');
        }
    });
});

// Funkcija za označavanje odabranog datuma kao zauzetog
function bookSelectedDate(selectedDateElement) {
    const selectedDateString = `${selectedDateElement.textContent} ${document.querySelector('.date__month').textContent}`;
    const isoSelectedDateString = new Date(selectedDateString).toISOString().split('T')[0];

    // Poziv API-ja za označavanje datuma kao zauzetog
    fetch('https://api.example.com/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: isoSelectedDateString, status: 'unavailable' }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Neuspješan zahtjev: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(`Datum ${isoSelectedDateString} označen kao zauzet.`);
    })
    .catch(error => {
        console.error('Greška prilikom označavanja datuma:', error);
    });
}

// Dohvati dostupne datume i ažuriraj kalendar
function updateCalendar() {
    fetchAvailableDates()
        .then(availableDates => markAvailableDates(availableDates))
        .catch(error => console.error('Greška pri ažuriranju kalendara:', error));
}

// Dodaj poziv ove funkcije kad se stranica učita
document.addEventListener('DOMContentLoaded', updateCalendar);

//Guests
const inputGuests = document.querySelector(".book__input-guests");
const minusBtn = document.querySelector(".book__minus");
const plusBtn = document.querySelector(".book__plus");
const guestsErr = document.querySelector(".guests-error");

hideMinus();

inputGuests.addEventListener("blur", () => {
    if(inputGuests.value == "" || inputGuests.value == "0") {
        inputGuests.value = "1";
        hideMinus();
        showPlus();
    } else if (Number(inputGuests.value) > 5) {
        inputGuests.value = "5";
        hidePlus();
        showMinus();
    } else {
        showMinus();
        showPlus();
    }
});


plusBtn.addEventListener("click", () => {
    showMinus(); 
    inputGuests.stepUp();
    if(Number(inputGuests.value) == 5) {
        hidePlus();
    } 
});

minusBtn.addEventListener("click", () => {
    showPlus();
    inputGuests.stepDown();
    if(Number(inputGuests.value) == 1) {
        hideMinus();
    }
});

function hidePlus() {
        plusBtn.classList.add("_no-active");
}
function showPlus() {
        plusBtn.classList.remove("_no-active");
}
function hideMinus() {
    minusBtn.classList.add("_no-active");
}
function showMinus() {
    minusBtn.classList.remove("_no-active");
}

//Skrivanje kalendara
window.onload = function () {

    const close = document.querySelector(".hide-calendar");
    const searchBtn = document.querySelectorAll(".book__search-date");
    const bookInput = document.querySelectorAll(".book__input");
    close.addEventListener("click", () => {
        Calendar.style.display = "none";
    });

    searchBtn.forEach(function(item) {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            for(let i = 0; i < bookInput.length; i++) {
                bookInput[i].classList.remove("_active-search");  
            }
            item.lastElementChild.classList.add("_active-search");
            if(Calendar.style.display == "none") {
                Calendar.style.display = "block";
            } 
        });
    });
};

//Kalendar

let nav = 0;
let clicked = null;

const calendar = document.querySelector('.days');

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  document.querySelector('.date__month').innerText = 
    `${dt.toLocaleDateString('en-us', { month: 'short' })} ${year}`;

  calendar.innerHTML = '';
 
  for(let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');
    
    
    
    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;

      if (i - paddingDays === day && nav === 0) {
        daySquare.classList.add("today");
      }
    } else {
      daySquare.classList.add('padding');
    }

    calendar.appendChild(daySquare);    
  }
}


function renderNextMonth() {
    nav++;
    const calendarSecond = document.querySelector('.days-d');
    function loadSecond() {
        const dt = new Date();
      
        if (nav !== 0) {
          dt.setMonth(new Date().getMonth() + nav);
        }
      
        const day = dt.getDate();
        const month = dt.getMonth();
        const year = dt.getFullYear();
        
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
          weekday: 'long',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        });
        const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
      
        document.querySelector('.date__month-d').innerText = 
          `${dt.toLocaleDateString('en-us', { month: 'short' })} ${year}`;
      
        calendarSecond.innerHTML = '';
       
        for(let i = 1; i <= paddingDays + daysInMonth; i++) {
          const daySquare = document.createElement('div');
          daySquare.classList.add('day');
          
          
          if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;
          
      
            if (i - paddingDays === day && nav === 0) {
              daySquare.classList.add("today");
            }
          } else {
            daySquare.classList.add('padding');
          }
      
          calendarSecond.appendChild(daySquare);    
        }
      }
      loadSecond();
}

function initButtons() {
  document.querySelector(".next").addEventListener('click', () => {
    load();
    renderNextMonth();
  });

  document.querySelector(".prev").addEventListener('click', () => {
    nav--;
    function loadM() {
        nav--;
        const dt = new Date();
      
        if (nav !== 0) {
          dt.setMonth(new Date().getMonth() + nav);
        }
      
        const day = dt.getDate();
        const month = dt.getMonth();
        const year = dt.getFullYear();
        
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
          weekday: 'long',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        });
        const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
      
        document.querySelector('.date__month').innerText = 
          `${dt.toLocaleDateString('en-us', { month: 'short' })} ${year}`;
      
        calendar.innerHTML = '';
       
        for(let i = 1; i <= paddingDays + daysInMonth; i++) {
          const daySquare = document.createElement('div');
          daySquare.classList.add('day');
          
          
          
          if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;
      
            if (i - paddingDays === day && nav === 0) {
              daySquare.classList.add("today");
            }
          } else {
            daySquare.classList.add('padding');
          }
      
          calendar.appendChild(daySquare);    
        }
      }
    function renderNextMonthm() {
        nav++;
        const calendarSecond = document.querySelector('.days-d');
        function loadSecond() {
            const dt = new Date();
          
            if (nav !== 0) {
              dt.setMonth(new Date().getMonth() + nav);
            }
          
            const day = dt.getDate();
            const month = dt.getMonth();
            const year = dt.getFullYear();
            
            const firstDayOfMonth = new Date(year, month, 1);
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
              weekday: 'long',
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            });
            const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
          
            document.querySelector('.date__month-d').innerText = 
              `${dt.toLocaleDateString('en-us', { month: 'short' })} ${year}`;
          
            calendarSecond.innerHTML = '';
           
            for(let i = 1; i <= paddingDays + daysInMonth; i++) {
              const daySquare = document.createElement('div');
              daySquare.classList.add('day');
              
              const dayString = `${month + 1}/${i - paddingDays}/${year}`;
              
              if (i > paddingDays) {
                daySquare.innerText = i - paddingDays;
              //   const eventForDay = events.find(e => e.date === dayString);
          
                if (i - paddingDays === day && nav === 0) {
                  daySquare.classList.add("today");
                }
              } else {
                daySquare.classList.add('padding');
              }
          
              calendarSecond.appendChild(daySquare);    
            }
          }
          loadSecond();
    }
    loadM();
    renderNextMonthm();
  });
}
initButtons();
load();
renderNextMonth();

//Search

const startDate = document.querySelector(".start-date");
const lastDate = document.querySelector(".last-date");
//onload first date
let options = { day: 'numeric', month: 'numeric', year: "numeric" };
let todayText = new Date().toLocaleString('en-us', options);
startDate.textContent = `${todayText}`;


const dayArr = document.querySelectorAll(".day");

dayArr.forEach(function(item) {
    
        item.addEventListener("click", () => { 

            if (startDate.classList.contains("_active-search")) {

                for (let i = 0; i < dayArr.length; i++) {
                    dayArr[i].classList.remove("_checked");
                    item.classList.add("_checked");
                    startDate.textContent = `${item.textContent} ${document.querySelector('.date__month').textContent}`;  
                }

                startDate.classList.remove("_active-search");
                lastDate.classList.add("_active-search");  

            }  else if (lastDate.classList.contains("_active-search")) {

                if (document.querySelector("._checked")) {

                    for (let i = 0; i < dayArr.length; i++) {
                        dayArr[i].classList.remove("_checked-up");
                        item.classList.add("_checked-up");
                        lastDate.textContent = `${item.textContent} ${document.querySelector('.date__month').textContent}`;
                        Calendar.style.display = "none";  
                    }

                }
            }

        });
   
    
})