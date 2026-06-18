export async function downloadFile(url: string, defaultName: string) {
    const response = await fetch(url);

    if (!response.ok) alert('파일을 다운로드하는 중 오류가 발생했습니다.')

    const blob = await response.blob();
    const blobUrl = globalThis.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = defaultName;
    document.body.appendChild(link);
    link.click();

    link.remove();
}
