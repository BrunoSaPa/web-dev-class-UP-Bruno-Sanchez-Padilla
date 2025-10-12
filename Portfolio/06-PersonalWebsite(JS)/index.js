function addToSchedule(event) {
    event.preventDefault();
    const date = event.target.elements.date.value;
    const start = event.target.elements.start.value;
    const end = event.target.elements.end.value;
    const activity = event.target.elements.activity.value;
    const place = event.target.elements.place.value;
    const type = event.target.elements.type.value;
    const notes = event.target.elements.notes.value;
    const busy = event.target.elements.busy.checked;
    
    const table = document.querySelector('.section-alt table');
    
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td>${date}</td>
        <td>${start}</td>
        <td>${end}</td>
        <td>${activity}</td>
        <td>${place}</td>
        <td>${type}</td>
        <td>${notes}</td>
        <td><img src="images/${busy ? 'busy' : 'free'}.png" alt="${busy ? 'Busy' : 'Free'}" width="24"></td>
    `;
    
    table.appendChild(newRow);
    
}

const form = document.querySelector('.section form');
form.addEventListener('submit', addToSchedule);