fetch('places.json')
  .then(res => {
    if (!res.ok) throw new Error('JSON 파일을 찾을 수 없음');
    return res.json();
  })
  .then(data => renderCards(data))
  .catch(err => console.error('오류:', err));

function renderCards(places) {
  const container = document.getElementById('card-container');

  places.forEach(place => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${place.image}" alt="${place.name}">
      <div class="card-content">
        <div class="card-title">${place.name}</div>
        <div class="card-location">${place.location}</div>
        <div class="card-desc">${place.desc}</div>
      </div>
    `;
    container.appendChild(card);
  });
}
