// ==========================================
// 各アプリのHTMLダウンロード機能
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // すべてのダウンロードボタンを取得
    const downloadButtons = document.querySelectorAll('.download-html-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const targetUrl = button.getAttribute('data-url');
            const appName = button.getAttribute('data-name');
            
            // ボタンを無効化してローディング状態にする
            button.disabled = true;
            const originalContent = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ダウンロード中...';
            
            try {
                // 対象のアプリのHTMLをフェッチ
                const response = await fetch(targetUrl);
                
                if (!response.ok) {
                    throw new Error('ダウンロードに失敗しました');
                }
                
                // HTMLテキストを取得
                const htmlContent = await response.text();
                
                // Blobを作成
                const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
                
                // ダウンロード用のリンクを作成
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = `${appName}.html`;
                
                // ダウンロードを実行
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                
                // URLオブジェクトを解放
                URL.revokeObjectURL(downloadLink.href);
                
                // 成功メッセージ
                button.innerHTML = '<i class="fas fa-check"></i> ダウンロード完了！';
                setTimeout(() => {
                    button.innerHTML = originalContent;
                    button.disabled = false;
                }, 2000);
                
            } catch (error) {
                console.error('ダウンロードエラー:', error);
                
                // エラーメッセージ
                button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> エラーが発生しました';
                setTimeout(() => {
                    button.innerHTML = originalContent;
                    button.disabled = false;
                }, 3000);
                
                // CORSエラーの場合は別タブで開く提案
                alert('HTMLダウンロードに失敗しました。\n\nCORSポリシーにより、直接ダウンロードできない場合があります。\n「アプリを開く」ボタンからアプリにアクセスし、ブラウザの「ファイル」→「名前を付けて保存」でHTMLを保存してください。');
            }
        });
    });
});

// ==========================================
// スムーススクロール
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// カードアニメーション（スクロール時）
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// すべてのアプリカードを監視
document.querySelectorAll('.app-card').forEach((card, index) => {
    // 初期状態を設定
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    
    // 監視開始
    observer.observe(card);
});