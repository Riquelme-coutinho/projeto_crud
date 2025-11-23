// Espera o documento carregar antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Funcionalidade de Editar Nome ---
    const usernameElement = document.getElementById('username');
    const editButton = document.getElementById('edit-btn');

    editButton.addEventListener('click', () => {
        // Pede ao usuário um novo nome usando uma caixa de diálogo simples
        const newName = prompt('Qual será seu novo nome?', usernameElement.textContent);

        // Verifica se o usuário não clicou em "Cancelar" e se digitou algo
        if (newName && newName.trim() !== '') {
            usernameElement.textContent = newName;
            
            // Bônus: Atualiza o avatar para combinar com o novo nome
            // (A função updateAvatar é definida abaixo)
            updateAvatar();
        }
    });

    // --- 2. Funcionalidade de Mudar Avatar ---
    const avatarImage = document.getElementById('avatar-img');
    
    // Lista de "estilos" de avatar que vamos usar do DiceBear
    const avatarStyles = ['bottts', 'adventurer', 'micah', 'croodles', 'big-ears', 'miniavs'];
    let currentStyleIndex = 0; // Começa com o primeiro estilo (bottts)

    avatarImage.addEventListener('click', () => {
        // Avança para o próximo estilo da lista
        // O '%' faz a lista voltar ao início (índice 0) quando chega ao fim
        currentStyleIndex = (currentStyleIndex + 1) % avatarStyles.length;
        
        // Atualiza o avatar
        updateAvatar();
    });
    
    // Função separada para atualizar a imagem do avatar
    function updateAvatar() {
        const currentStyle = avatarStyles[currentStyleIndex];
        const currentName = usernameElement.textContent;
        
        // Usamos a API do DiceBear:
        // 'currentStyle' muda o tipo de avatar (robô, aventureiro, etc.)
        // 'seed=currentName' faz com que o avatar seja único para cada nome
        avatarImage.src = `https://api.dicebear.com/7.x/${currentStyle}/svg?seed=${currentName}`;
    }

});

