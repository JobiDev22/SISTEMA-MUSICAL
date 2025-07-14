// Upload Musical Controller
class UploadMusicalController {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('addMusicBtn').addEventListener('click', () => {
            this.showAddMusicModal();
        });
    }

    loadMusics() {
        const musics = this.getAllMusics();
        this.renderMusicCards(musics);
    }

    getAllMusics() {
        return JSON.parse(localStorage.getItem('musics') || '[]');
    }

    renderMusicCards(musics) {
        const grid = document.getElementById('musicCardsGrid');
        if (!grid) return;
        if (musics.length === 0) {
            grid.innerHTML = `<div class="no-data">Nenhuma música cadastrada</div>`;
            return;
        }
        grid.innerHTML = musics.map(music => `
            <div class="music-card" data-music-id="${music.id}">
                <div class="music-card-cover">
                    ${music.capa ? `<img src="${music.capa}" alt="Capa">` : `<div class="music-card-placeholder">Em criação</div>`}
                    <button class="music-card-delete" title="Excluir" onclick="event.stopPropagation(); uploadMusicalController.deleteMusic(${music.id})"><i class="fas fa-trash"></i></button>
                </div>
                <div class="music-card-body">
                    <div class="music-card-title">${music.titulo || music.interprete || 'Sem título'}</div>
                    <div class="music-card-artists">${music.dj ? music.dj : ''}${music.dj && music.interprete ? ' - ' : ''}${music.interprete ? music.interprete : ''}</div>
                    <div class="music-card-date">${music.dataPublicacao ? app.formatDate(music.dataPublicacao) : ''}</div>
                    <div class="music-card-tags">
                        ${music.status ? `<span class="music-tag status-${music.status}">${music.status === 'disponivel' ? 'Disponível' : music.status === 'distribuida' ? 'Distribuída' : 'Em criação'}</span>` : ''}
                        ${music.genero ? `<span class="music-tag">${this.getGeneroText(music.genero)}</span>` : ''}
                        <span class="music-tag">Song</span>
                    </div>
                </div>
            </div>
        `).join('');
        // Eventos de clique nos cards
        grid.querySelectorAll('.music-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const musicId = parseInt(card.getAttribute('data-music-id'));
                const music = this.getMusicById(musicId);
                if (music) this.showEditMusicModal(music, true);
            });
        });
    }

    addMusicActionEventListeners() {
        document.querySelectorAll('.btn-action').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                const musicId = parseInt(e.currentTarget.dataset.musicId);
                this.handleMusicAction(action, musicId);
            });
        });
    }

    handleMusicAction(action, musicId) {
        const music = this.getMusicById(musicId);
        if (!music) return;

        switch (action) {
            case 'view':
                this.showMusicDetails(music);
                break;
            case 'edit':
                this.showEditMusicModal(music);
                break;
            case 'delete':
                this.deleteMusic(musicId);
                break;
        }
    }

    showAddMusicModal() {
        const modalContent = `
            <div class="modal-header">
                <h3>Adicionar Nova Música</h3>
                <button class="modal-close" onclick="modalController.close()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="addMusicForm">
                    <div class="form-group">
                        <label for="musicCapa">Capa da Música</label>
                        <input type="file" id="musicCapa" accept="image/*">
                        <div id="previewCapaAdd" style="margin-top:8px;"></div>
                    </div>
                    <div class="form-group">
                        <label for="musicTitulo">Título</label>
                        <input type="text" id="musicTitulo" placeholder="Título da música">
                    </div>
                    <div class="form-group">
                        <label for="musicDataPublicacao">Data de Publicação</label>
                        <input type="date" id="musicDataPublicacao" required>
                    </div>
                    <div class="form-group">
                        <label for="musicDJ">DJ</label>
                        <input type="text" id="musicDJ" placeholder="Nome do DJ" required>
                    </div>
                    <div class="form-group">
                        <label for="musicInterprete">Intérprete</label>
                        <input type="text" id="musicInterprete" placeholder="Nome do intérprete" required>
                    </div>
                    <div class="form-group">
                        <label for="musicLink">Link da Música</label>
                        <input type="url" id="musicLink" placeholder="https://..." required>
                    </div>
                    <div class="form-group">
                        <label for="musicGenero">Gênero</label>
                        <select id="musicGenero">
                            <option value="">Selecione um gênero</option>
                            <option value="house">House</option>
                            <option value="techno">Techno</option>
                            <option value="trance">Trance</option>
                            <option value="dubstep">Dubstep</option>
                            <option value="drum-bass">Drum & Bass</option>
                            <option value="edm">EDM</option>
                            <option value="pop">Pop</option>
                            <option value="rock">Rock</option>
                            <option value="outro">Outro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="musicBpm">BPM</label>
                        <input type="number" id="musicBpm" placeholder="120" min="60" max="200">
                    </div>
                    <div class="form-group">
                        <label for="musicDuracao">Duração (minutos)</label>
                        <input type="number" id="musicDuracao" placeholder="3.5" step="0.1" min="0.1">
                    </div>
                    <div class="form-group">
                        <label for="musicObservacoes">Observações</label>
                        <textarea id="musicObservacoes" rows="3" placeholder="Observações adicionais..."></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="modalController.close()">Cancelar</button>
                <button class="btn-primary" onclick="uploadMusicalController.saveNewMusic()">Salvar</button>
            </div>
        `;
        modalController.show(modalContent);
        // Preview da imagem
        const inputCapa = document.getElementById('musicCapa');
        inputCapa.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('previewCapaAdd').innerHTML = `<img src='${e.target.result}' style='max-width:100px;max-height:100px;border-radius:8px;'>`;
                };
                reader.readAsDataURL(file);
            } else {
                document.getElementById('previewCapaAdd').innerHTML = '';
            }
        });
    }

    saveNewMusic() {
        const dataPublicacao = document.getElementById('musicDataPublicacao').value;
        const dj = document.getElementById('musicDJ').value;
        const interprete = document.getElementById('musicInterprete').value;
        const link = document.getElementById('musicLink').value;
        const genero = document.getElementById('musicGenero').value;
        const bpm = document.getElementById('musicBpm').value;
        const duracao = document.getElementById('musicDuracao').value;
        const observacoes = document.getElementById('musicObservacoes').value;
        const titulo = document.getElementById('musicTitulo').value;
        const inputCapa = document.getElementById('musicCapa');
        let capa = '';
        if (inputCapa.files && inputCapa.files[0]) {
            capa = document.getElementById('previewCapaAdd').querySelector('img')?.src || '';
        }
        if (!dataPublicacao || !dj || !interprete || !link) {
            app.showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }
        // Validate URL
        try {
            new URL(link);
        } catch {
            app.showNotification('Link inválido', 'error');
            return;
        }
        const newMusic = {
            id: Date.now(),
            dataPublicacao,
            dj,
            interprete,
            link,
            genero,
            bpm: bpm ? parseInt(bpm) : null,
            duracao: duracao ? parseFloat(duracao) : null,
            observacoes,
            titulo,
            capa,
            createdAt: new Date().toISOString(),
            createdBy: authController.currentUser ? authController.currentUser.id : null
        };
        const musics = this.getAllMusics();
        musics.push(newMusic);
        localStorage.setItem('musics', JSON.stringify(musics));
        modalController.close();
        this.loadMusics();
        app.showNotification('Música adicionada com sucesso!', 'success');
    }

    showMusicDetails(music) {
        const modalContent = `
            <div class="modal-header">
                <h3>Detalhes da Música</h3>
                <button class="modal-close" onclick="modalController.close()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="music-details-grid">
                    <div class="detail-item">
                        <label>Data de Publicação:</label>
                        <span>${app.formatDate(music.dataPublicacao)}</span>
                    </div>
                    <div class="detail-item">
                        <label>DJ:</label>
                        <span>${music.dj}</span>
                    </div>
                    <div class="detail-item">
                        <label>Intérprete:</label>
                        <span>${music.interprete}</span>
                    </div>
                    <div class="detail-item">
                        <label>Link:</label>
                        <a href="${music.link}" target="_blank" class="music-link">
                            <i class="fas fa-external-link-alt"></i>
                            Ouvir Música
                        </a>
                    </div>
                    ${music.genero ? `
                        <div class="detail-item">
                            <label>Gênero:</label>
                            <span>${this.getGeneroText(music.genero)}</span>
                        </div>
                    ` : ''}
                    ${music.bpm ? `
                        <div class="detail-item">
                            <label>BPM:</label>
                            <span>${music.bpm}</span>
                        </div>
                    ` : ''}
                    ${music.duracao ? `
                        <div class="detail-item">
                            <label>Duração:</label>
                            <span>${music.duracao} minutos</span>
                        </div>
                    ` : ''}
                    ${music.observacoes ? `
                        <div class="detail-item">
                            <label>Observações:</label>
                            <span>${music.observacoes}</span>
                        </div>
                    ` : ''}
                    <div class="detail-item">
                        <label>Data de Cadastro:</label>
                        <span>${app.formatDateTime(music.createdAt)}</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="modalController.close()">Fechar</button>
                <button class="btn-primary" onclick="uploadMusicalController.playMusic('${music.link}')">
                    <i class="fas fa-play"></i>
                    Ouvir
                </button>
            </div>
        `;

        modalController.show(modalContent);
    }

    showEditMusicModal(music, isCardClick = false) {
        const modalContent = `
            <div class="modal-header">
                <h3>Editar Música</h3>
                <button class="modal-close" onclick="modalController.close()">&times;</button>
            </div>
            <div class="modal-body music-edit-body">
                <form id="editMusicForm">
                    <div class="form-group">
                        <label for="editMusicCapa">Capa da Música</label>
                        <input type="file" id="editMusicCapa" accept="image/*">
                        <div id="previewCapaEdit" style="margin-top:8px;">
                            ${music.capa ? `<img src='${music.capa}' style='max-width:100px;max-height:100px;border-radius:8px;'>` : ''}
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="editMusicTitulo">Título</label>
                        <input type="text" id="editMusicTitulo" value="${music.titulo || ''}" placeholder="Título da música">
                    </div>
                    <div class="form-group">
                        <label for="editMusicDataPublicacao">Data de Publicação</label>
                        <input type="date" id="editMusicDataPublicacao" value="${music.dataPublicacao || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="editMusicDJ">DJ</label>
                        <input type="text" id="editMusicDJ" value="${music.dj || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="editMusicInterprete">Intérprete</label>
                        <input type="text" id="editMusicInterprete" value="${music.interprete || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="editMusicLink">Link da Música</label>
                        <input type="url" id="editMusicLink" value="${music.link || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="editMusicGenero">Gênero</label>
                        <select id="editMusicGenero">
                            <option value="">Selecione um gênero</option>
                            <option value="house" ${music.genero === 'house' ? 'selected' : ''}>House</option>
                            <option value="techno" ${music.genero === 'techno' ? 'selected' : ''}>Techno</option>
                            <option value="trance" ${music.genero === 'trance' ? 'selected' : ''}>Trance</option>
                            <option value="dubstep" ${music.genero === 'dubstep' ? 'selected' : ''}>Dubstep</option>
                            <option value="drum-bass" ${music.genero === 'drum-bass' ? 'selected' : ''}>Drum & Bass</option>
                            <option value="edm" ${music.genero === 'edm' ? 'selected' : ''}>EDM</option>
                            <option value="pop" ${music.genero === 'pop' ? 'selected' : ''}>Pop</option>
                            <option value="rock" ${music.genero === 'rock' ? 'selected' : ''}>Rock</option>
                            <option value="outro" ${music.genero === 'outro' ? 'selected' : ''}>Outro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editMusicBpm">BPM</label>
                        <input type="number" id="editMusicBpm" value="${music.bpm || ''}" min="60" max="200">
                    </div>
                    <div class="form-group">
                        <label for="editMusicDuracao">Duração (minutos)</label>
                        <input type="number" id="editMusicDuracao" value="${music.duracao || ''}" step="0.1" min="0.1">
                    </div>
                    <div class="form-group">
                        <label for="editMusicObservacoes">Observações</label>
                        <textarea id="editMusicObservacoes" rows="3">${music.observacoes || ''}</textarea>
                    </div>
                </form>
                <div style="margin-top:16px; text-align:right;">
                    <button class="btn-secondary" onclick="uploadMusicalController.deleteMusic(${music.id})" style="background:#dc3545; color:#fff; float:left;">Excluir</button>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="modalController.close()">Cancelar</button>
                <button class="btn-primary" onclick="uploadMusicalController.saveMusicEdit(${music.id})">Salvar</button>
            </div>
        `;
        modalController.show(modalContent);
        // Preview da imagem
        const inputCapa = document.getElementById('editMusicCapa');
        inputCapa.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('previewCapaEdit').innerHTML = `<img src='${e.target.result}' style='max-width:100px;max-height:100px;border-radius:8px;'>`;
                };
                reader.readAsDataURL(file);
            } else {
                document.getElementById('previewCapaEdit').innerHTML = '';
            }
        });
        // Se for painel lateral, adicionar classe especial
        if (isCardClick) {
            document.getElementById('modal').classList.add('music-edit-panel');
        } else {
            document.getElementById('modal').classList.remove('music-edit-panel');
        }
    }

    saveMusicEdit(musicId) {
        const dataPublicacao = document.getElementById('editMusicDataPublicacao').value;
        const dj = document.getElementById('editMusicDJ').value;
        const interprete = document.getElementById('editMusicInterprete').value;
        const link = document.getElementById('editMusicLink').value;
        const genero = document.getElementById('editMusicGenero').value;
        const bpm = document.getElementById('editMusicBpm').value;
        const duracao = document.getElementById('editMusicDuracao').value;
        const observacoes = document.getElementById('editMusicObservacoes').value;
        const titulo = document.getElementById('editMusicTitulo').value;
        const inputCapa = document.getElementById('editMusicCapa');
        let capa = '';
        if (inputCapa.files && inputCapa.files[0]) {
            capa = document.getElementById('previewCapaEdit').querySelector('img')?.src || '';
        } else {
            capa = document.getElementById('previewCapaEdit').querySelector('img')?.src || '';
        }
        if (!dataPublicacao || !dj || !interprete || !link) {
            app.showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }
        // Validate URL
        try {
            new URL(link);
        } catch {
            app.showNotification('Link inválido', 'error');
            return;
        }
        const musics = this.getAllMusics();
        const musicIndex = musics.findIndex(m => m.id === musicId);
        if (musicIndex === -1) {
            app.showNotification('Música não encontrada', 'error');
            return;
        }
        musics[musicIndex] = {
            ...musics[musicIndex],
            dataPublicacao,
            dj,
            interprete,
            link,
            genero,
            bpm: bpm ? parseInt(bpm) : null,
            duracao: duracao ? parseFloat(duracao) : null,
            observacoes,
            titulo,
            capa,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem('musics', JSON.stringify(musics));
        modalController.close();
        this.loadMusics();
        app.showNotification('Música atualizada com sucesso!', 'success');
    }

    deleteMusic(musicId) {
        const music = this.getMusicById(musicId);
        if (confirm(`Confirmar exclusão da música "${music.interprete} - ${music.dj}"?`)) {
            const musics = this.getAllMusics();
            const filteredMusics = musics.filter(m => m.id !== musicId);
            localStorage.setItem('musics', JSON.stringify(filteredMusics));
            this.loadMusics();
            app.showNotification('Música excluída com sucesso!', 'success');
        }
    }

    getMusicById(musicId) {
        const musics = this.getAllMusics();
        return musics.find(m => m.id === musicId);
    }

    getGeneroText(genero) {
        const generos = {
            'house': 'House',
            'techno': 'Techno',
            'trance': 'Trance',
            'dubstep': 'Dubstep',
            'drum-bass': 'Drum & Bass',
            'edm': 'EDM',
            'pop': 'Pop',
            'rock': 'Rock',
            'outro': 'Outro'
        };
        return generos[genero] || genero;
    }

    playMusic(link) {
        window.open(link, '_blank');
    }

    // Search and filter functionality
    searchMusics(query) {
        const musics = this.getAllMusics();
        const filteredMusics = musics.filter(music => 
            music.dj.toLowerCase().includes(query.toLowerCase()) ||
            music.interprete.toLowerCase().includes(query.toLowerCase()) ||
            music.genero?.toLowerCase().includes(query.toLowerCase())
        );
        this.renderMusicCards(filteredMusics);
    }

    filterMusicsByGenero(genero) {
        const musics = this.getAllMusics();
        const filteredMusics = genero === 'all' 
            ? musics 
            : musics.filter(music => music.genero === genero);
        this.renderMusicCards(filteredMusics);
    }

    filterMusicsByDate(startDate, endDate) {
        const musics = this.getAllMusics();
        const filteredMusics = musics.filter(music => {
            const musicDate = new Date(music.dataPublicacao);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            
            if (start && end) {
                return musicDate >= start && musicDate <= end;
            } else if (start) {
                return musicDate >= start;
            } else if (end) {
                return musicDate <= end;
            }
            return true;
        });
        this.renderMusicCards(filteredMusics);
    }

    // Export music data
    exportMusicData() {
        const musics = this.getAllMusics();
        const data = {
            musics: musics.map(music => ({
                id: music.id,
                dataPublicacao: music.dataPublicacao,
                dj: music.dj,
                interprete: music.interprete,
                link: music.link,
                genero: music.genero,
                bpm: music.bpm,
                duracao: music.duracao,
                observacoes: music.observacoes,
                createdAt: music.createdAt
            })),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `musics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Statistics
    getMusicStats() {
        const musics = this.getAllMusics();
        
        const stats = {
            total: musics.length,
            byGenero: {},
            byMonth: {},
            averageBpm: 0,
            totalDuration: 0
        };

        let totalBpm = 0;
        let bpmCount = 0;
        let totalDuration = 0;

        musics.forEach(music => {
            // By genre
            if (music.genero) {
                stats.byGenero[music.genero] = (stats.byGenero[music.genero] || 0) + 1;
            }

            // By month
            const date = new Date(music.dataPublicacao);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            stats.byMonth[monthKey] = (stats.byMonth[monthKey] || 0) + 1;

            // BPM average
            if (music.bpm) {
                totalBpm += music.bpm;
                bpmCount++;
            }

            // Total duration
            if (music.duracao) {
                totalDuration += music.duracao;
            }
        });

        stats.averageBpm = bpmCount > 0 ? Math.round(totalBpm / bpmCount) : 0;
        stats.totalDuration = totalDuration;

        return stats;
    }
}

// Initialize upload musical controller
window.uploadMusicalController = new UploadMusicalController(); 