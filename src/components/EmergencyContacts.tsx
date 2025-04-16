'use client';

import { useState, useEffect } from 'react';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/emergency-contacts?userId=test-user'); // TODO: 실제 사용자 ID로 교체
      if (!response.ok) {
        throw new Error('연락처를 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setContacts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/emergency-contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'test-user', // TODO: 실제 사용자 ID로 교체
          ...newContact,
        }),
      });

      if (!response.ok) {
        throw new Error('연락처 추가에 실패했습니다.');
      }

      setNewContact({ name: '', phone: '', relationship: '' });
      fetchContacts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 연락처를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/emergency-contacts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('연락처 삭제에 실패했습니다.');
      }

      fetchContacts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">비상 연락처 관리</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              id="name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              전화번호
            </label>
            <input
              type="tel"
              id="phone"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">
              관계
            </label>
            <input
              type="text"
              id="relationship"
              value={newContact.relationship}
              onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          {isLoading ? '추가 중...' : '연락처 추가'}
        </button>
      </form>

      {error && (
        <div className="text-red-500 text-sm mb-4">{error}</div>
      )}

      <div className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
            <div>
              <h3 className="font-medium">{contact.name}</h3>
              <p className="text-sm text-gray-600">{contact.phone}</p>
              <p className="text-sm text-gray-500">{contact.relationship}</p>
            </div>
            <button
              onClick={() => handleDelete(contact.id)}
              className="text-red-500 hover:text-red-700"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 