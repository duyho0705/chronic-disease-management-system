import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { sendChatPushNotification } from '@/api/portal';

export interface ChatMessage {
    id?: string;
    senderId: string;
    senderType: 'PATIENT' | 'DOCTOR' | 'SYSTEM';
    content: string;
    sentAt: Date | string | any;
    isImage?: boolean;
    imageUrl?: string;
    fileUrl?: string;
}

export function useFirebaseChat(tenantId: string | undefined | null, patientId: string | undefined | null, doctorId: string | undefined | null) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);

    const roomId = tenantId && patientId && doctorId ? `${tenantId}_${patientId}_${doctorId}` : null;

    useEffect(() => {
        if (!roomId) {
            setMessages([]);
            setLoading(false);
            return;
        }

        const messagesRef = collection(db, 'chats', roomId, 'messages');
        const q = query(messagesRef, orderBy('sentAt', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedMessages: ChatMessage[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                loadedMessages.push({
                    id: doc.id,
                    senderId: data.senderId,
                    senderType: data.senderType,
                    content: data.content,
                    sentAt: data.sentAt?.toDate ? data.sentAt.toDate().toISOString() : new Date().toISOString(),
                    isImage: data.isImage,
                    imageUrl: data.imageUrl,
                    fileUrl: data.fileUrl
                });
            });
            setMessages(loadedMessages);
            setLoading(false);
        }, (error) => {
            console.error("Firebase chat error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [roomId]);

    const sendMessage = async (content: string, senderId: string, senderType: 'PATIENT' | 'DOCTOR' | 'SYSTEM', imageUrl?: string, fileUrl?: string) => {
        if (!roomId) return;

        // Ensure room doc exists for listing later
        const roomRef = doc(db, 'chats', roomId);
        await setDoc(roomRef, {
            tenantId,
            patientId,
            doctorId,
            lastMessage: content,
            lastMessageSenderType: senderType,
            lastMessageTime: serverTimestamp()
        }, { merge: true });

        // Add message
        const messagesRef = collection(db, 'chats', roomId, 'messages');
        await addDoc(messagesRef, {
            senderId,
            senderType,
            content,
            sentAt: serverTimestamp(),
            ...(imageUrl ? { isImage: true, imageUrl } : {}),
            ...(fileUrl ? { fileUrl } : {})
        });

        // Backend Push Notification
        const recipientId = senderType === 'PATIENT' ? doctorId : patientId;
        if (recipientId) {
            sendChatPushNotification({
                roomId,
                senderType,
                recipientId,
                content,
                isImage: !!imageUrl,
                fileUrl
            }, { tenantId: tenantId || '', branchId: '' }).catch(console.warn);
        }
    };

    return { messages, loading, sendMessage, roomId };
}
