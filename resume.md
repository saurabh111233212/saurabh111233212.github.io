---
layout: default
title: "Saurabh Shah - Resume"
description: "Resume of Saurabh Shah, Member of Technical Staff at humans&"
permalink: /resume/
---

<div class="resume-container">
    <div class="resume-header">
        <h1>Resume</h1>
        <div class="resume-controls">
            <a href="/assets/Saurabh_Shah_Resume.pdf" target="_blank" class="download-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                Download PDF
            </a>
            <a href="/assets/Saurabh_Shah_Resume.pdf" target="_blank" class="view-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                </svg>
                View in Browser
            </a>
        </div>
    </div>
    
    <div class="pdf-viewer-container">
        <div class="pdf-loading" id="pdf-loading">
            <div class="loading-spinner"></div>
            <p>Loading resume...</p>
        </div>
        <div class="pdf-container" id="pdf-container" style="display: none;">
            <canvas id="pdf-canvas"></canvas>
            <div id="text-layer" class="text-layer"></div>
            <div id="annotation-layer" class="annotation-layer"></div>
        </div>
        <div class="pdf-fallback" id="pdf-fallback" style="display: none;">
            <p>Unable to display PDF. Please <a href="/assets/Saurabh_Shah_Resume.pdf" target="_blank">download the resume</a> to view it.</p>
        </div>
    </div>
</div>

<!-- Load PDF.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>
// Configure PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const loadingEl = document.getElementById('pdf-loading');
const fallbackEl = document.getElementById('pdf-fallback');
const containerEl = document.getElementById('pdf-container');
const textLayerEl = document.getElementById('text-layer');
const annotationLayerEl = document.getElementById('annotation-layer');

// Get device pixel ratio for crisp rendering
const devicePixelRatio = window.devicePixelRatio || 1;

// Function to render a page
function renderPage(num) {
    pageRendering = true;
    
    pdfDoc.getPage(num).then(function(page) {
        // Calculate scale based on container width
        const container = document.querySelector('.pdf-viewer-container');
        const containerWidth = container.clientWidth - 32; // Account for padding
        const viewport = page.getViewport({scale: 1.0});
        const desiredWidth = Math.min(containerWidth, 800); // Max width
        const scale = desiredWidth / viewport.width;
        
        const scaledViewport = page.getViewport({scale: scale});
        
        // Set canvas size accounting for device pixel ratio
        canvas.height = scaledViewport.height * devicePixelRatio;
        canvas.width = scaledViewport.width * devicePixelRatio;
        canvas.style.height = scaledViewport.height + 'px';
        canvas.style.width = scaledViewport.width + 'px';
        
        // Scale context for device pixel ratio
        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        
        const renderContext = {
            canvasContext: ctx,
            viewport: scaledViewport
        };
        
        const renderTask = page.render(renderContext);
        
        renderTask.promise.then(function() {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
            
            // Clear previous layers
            textLayerEl.innerHTML = '';
            annotationLayerEl.innerHTML = '';
            
            // Set container size
            containerEl.style.width = scaledViewport.width + 'px';
            containerEl.style.height = scaledViewport.height + 'px';
            
            // Render text layer for better text selection and searchability
            page.getTextContent().then(function(textContent) {
                const textLayerFactory = new pdfjsLib.TextLayerBuilder({
                    textLayerDiv: textLayerEl,
                    pageIndex: num - 1,
                    viewport: scaledViewport
                });
                textLayerFactory.setTextContent(textContent);
                textLayerFactory.render();
            });
            
            // Render annotation layer for clickable links
            page.getAnnotations().then(function(annotations) {
                const annotationLayerFactory = new pdfjsLib.AnnotationLayerBuilder({
                    pageDiv: containerEl,
                    pdfPage: page,
                    annotations: annotations,
                    viewport: scaledViewport,
                    linkService: {
                        externalLinkTarget: pdfjsLib.LinkTarget.BLANK,
                        externalLinkEnabled: true
                    }
                });
                annotationLayerFactory.render(scaledViewport);
            });
        });
    });
}

// Function to queue render if another render is in progress
function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

// Load and render the PDF
pdfjsLib.getDocument('/assets/Saurabh_Shah_Resume.pdf').promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    
    // Hide loading, show container
    loadingEl.style.display = 'none';
    containerEl.style.display = 'block';
    
    // Initial render
    renderPage(pageNum);
}).catch(function(error) {
    console.error('Error loading PDF:', error);
    loadingEl.style.display = 'none';
    fallbackEl.style.display = 'block';
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        if (pdfDoc) {
            queueRenderPage(pageNum);
        }
    }, 250);
});
</script> 