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

    // 카드 클릭 시 세부 정보 표시
    card.addEventListener('click', () => showDetail(place));

    container.appendChild(card);
  });
}

function showDetail(place) {
  let detail = document.getElementById('detail-view');

  // 처음 클릭 시 detail-view 요소 생성
  if (!detail) {
    detail = document.createElement('div');
    detail.id = 'detail-view';
    document.body.appendChild(detail);
  }

  // 내용 업데이트
  detail.innerHTML = `
    <hr />
    <h2>${place.name}</h2>
    <img src="${place.image}" alt="${place.name}" width="250">
    <p><strong>위치:</strong> ${place.location}</p>
    <p><strong>설명:</strong> ${place.desc}</p>
  `;

  detail.scrollIntoView({ behavior: 'smooth' });
}

function showDetail(place) {
  const oldModal = document.getElementById('modal-overlay');
  if (oldModal) oldModal.remove();

  const overlay = document.createElement('div');
  overlay.id = 'modal-overlay';

  const modal = document.createElement('div');
  modal.id = 'modal-box';

  // 찜 여부 확인 (localStorage에 저장된 값 확인)
  const storageKey = `liked:${place.name}`;
  let isLiked = localStorage.getItem(storageKey) === 'true';

  modal.innerHTML = `
    <span id="modal-close">&times;</span>
    <h2>${place.name}</h2>
    <img src="${place.image}" alt="${place.name}" width="250">
    <p><strong>위치:</strong> ${place.location}</p>
    <p><strong>설명:</strong> ${place.desc}</p>
    <button id="like-button">${isLiked ? '❤️ 찜 취소' : '🤍 찜하기'}</button>
  `;

  // 찜 버튼 클릭 시 localStorage에 저장/삭제
  modal.querySelector('#like-button').addEventListener('click', function () {
    isLiked = !isLiked;
    localStorage.setItem(storageKey, isLiked);
    this.textContent = isLiked ? '❤️ 찜 취소' : '🤍 찜하기';
  });

  // 닫기 이벤트
  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target.id === 'modal-close') {
      overlay.remove();
    }
  });

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

//카드 태그로 필터링 로직
const filter = JSON.parse(localStorage.getItem('filter'));

fetch('data/data.json')
  .then(res => res.json())
  .then(data => {
    const filtered = data.filter(place => {
      const tags = place.tags;

      const timeMatch = !filter.time || tags.time.includes(filter.time);
      const purposeMatch = !filter.purpose || tags.purpose.includes(filter.purpose);
      const moodMatch = !filter.mood || tags.mood.includes(filter.mood);

      return timeMatch && purposeMatch && moodMatch;
    });

    renderCards(filtered);
  });
