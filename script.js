document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const videoPreview = document.getElementById('videoPreview');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');
    const submitBtn = document.getElementById('submitBtn');
    const videosGrid = document.getElementById('videosGrid');

    // For demo purposes - stores uploaded videos
    let uploadedVideos = JSON.parse(localStorage.getItem('uploadedVideos')) || [];

    // Display existing videos
    renderUploadedVideos();

    // Handle file selection via button
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });

    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropZone.classList.add('drag-over');
    }

    function unhighlight() {
        dropZone.classList.remove('drag-over');
    }

    dropZone.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        handleFileUpload(file);
    });

    // Handle file upload
    function handleFileUpload(file) {
        if (!file.type.startsWith('video/')) {
            alert('Please upload a video file');
            return;
        }

        // Show progress bar
        progressContainer.style.display = 'block';
        
        // Simulate upload progress (in a real app, this would be an actual upload to a server)
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Update progress bar
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `${progress}%`;
                
                // Show video preview after upload completes
                setTimeout(() => {
                    showVideoPreview(file);
                }, 500);
            } else {
                // Update progress bar
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `${progress}%`;
            }
        }, 200);
    }

    // Show video preview
    function showVideoPreview(file) {
        const videoURL = URL.createObjectURL(file);
        videoPlayer.src = videoURL;
        videoPreview.style.display = 'block';
        
        // Set default title to filename without extension
        const fileName = file.name;
        const cleanName = fileName.substring(0, fileName.lastIndexOf('.'));
        videoTitle.value = cleanName;
    }

    // Handle video submission
    submitBtn.addEventListener('click', function() {
        const title = videoTitle.value.trim();
        const description = videoDescription.value.trim();
        
        if (!title) {
            alert('Please enter a title for your video');
            return;
        }
        
        // In a real app, you would send this data to your server
        // For demo, we'll store it in localStorage
        const newVideo = {
            id: Date.now(),
            title: title,
            description: description,
            date: new Date().toLocaleDateString(),
            thumbnail: 'https://placehold.co/300x200?text=Video+Thumbnail'
        };
        
        uploadedVideos.unshift(newVideo);
        localStorage.setItem('uploadedVideos', JSON.stringify(uploadedVideos));
        
        // Reset form
        videoPlayer.src = '';
        videoTitle.value = '';
        videoDescription.value = '';
        videoPreview.style.display = 'none';
        progressContainer.style.display = 'none';
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        
        // Update video list
        renderUploadedVideos();
        
        alert('Video published successfully!');
    });

    // Render uploaded videos
    function renderUploadedVideos() {
        if (uploadedVideos.length === 0) {
            videosGrid.innerHTML = `
                <div class="empty-state">
                    <img src="https://placehold.co/300x200" alt="Empty video library with film reel and plus sign" onerror="this.src='https://via.placeholder.com/300x200?text=No+Videos'">
                    <p>No videos uploaded yet</p>
                </div>
            `;
            return;
        }
        
        videosGrid.innerHTML = uploadedVideos.map(video => `
            <div class="video-card">
                <img src="${video.thumbnail}" alt="Thumbnail for video titled ${video.title}" class="video-thumbnail" onerror="this.src='https://via.placeholder.com/300x200?text=Thumbnail'">
                <div class="video-details">
                    <h4>${video.title}</h4>
                    <p>${video.description || 'No description'}</p>
                    <small>Uploaded: ${video.date}</small>
                </div>
            </div>
        `).join('');
    }
});

