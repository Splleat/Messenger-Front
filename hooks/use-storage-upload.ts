import { useState } from 'react';
import { PresignRequest } from '@/types/common';
import {authenticatedFetch} from "@/lib/api-auth";
import {Session} from "next-auth";

export function useStorageUpload(session: Session) {
    const [isUploading, setIsUploading] = useState(false);

    const uploadFile = async (file: File) => {
        const presignRequest: PresignRequest = {
            fileName: file.name,
            contentType: file.type,
            size: file.size,
        };

        setIsUploading(true);

        try {
            const response = await authenticatedFetch(
                session,
                'http://localhost:8080/attachments/presign',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(presignRequest),
                },
            );

            if (!response.ok) {
                throw new Error('파일 URL 생성 실패')
            }

            const { uploadUrl, objectKey } = await response.json();

            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file,
            });

            if (!uploadResponse.ok) {
                throw new Error('스토리지 업로드 실패')
            }

            return objectKey;
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadFile, isUploading };
}