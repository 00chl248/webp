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
  // 기존 모달이 있다면 제거
  const oldModal = document.getElementById('modal-overlay');
  if (oldModal) oldModal.remove();

  // 오버레이 생성
  const overlay = document.createElement('div');
  overlay.id = 'modal-overlay';

  // 모달 내용
  const modal = document.createElement('div');
  modal.id = 'modal-box';
  modal.innerHTML = `
    <span id="modal-close">&times;</span>
    <h2>${place.name}</h2>
    <img src="${place.image}" alt="${place.name}" width="250">
    <p><strong>위치:</strong> ${place.location}</p>
    <p><strong>설명:</strong> ${place.desc}</p>
  `;

  // 모달 닫기 (X 버튼 또는 바깥 클릭)
  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target.id === 'modal-close') {
      overlay.remove();
    }
  });

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}
