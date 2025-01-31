import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { firestore2 } from './firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Feedback = ({ isModalOpen, setIsModalOpen }) => {
  const [name, setName] = useState('Anonymous');
  const [suggestion, setSuggestion] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(firestore2, 'suggestions'), {
        name: name.trim(),
        topic: 'SlideWonder',
        suggestion: suggestion.trim(),
        timestamp: serverTimestamp(),
        status: 'incomplete',
      });
      setName('Anonymous');
      setSuggestion('');
    } catch (error) {
      console.error('Error adding suggestion: ', error);
    }
  };

  const handleProjectClick = async () => {
    try {
      await addDoc(collection(firestore2, 'feedback'), {
        project: 'SlideWonder',
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div
      style={{
        display: isModalOpen ? 'block' : 'none',
        position: 'fixed',
        zIndex: 75,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingTop: '60px',
        color: '#333',
      }}
    >
      <div>
        <div
          style={{
            backgroundColor: '#fff',
            margin: '5% auto',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            width: '90%',
            maxWidth: '500px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h5
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              Feedback for SlideWonder
            </h5>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{
                color: '#aaa',
                fontSize: '28px',
                fontWeight: 'bold',
                transition: 'color 0.3s ease',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.target.style.color = '#000')}
              onMouseLeave={(e) => (e.target.style.color = '#aaa')}
            >
              <Icon icon="mdi:close" width="24" />
            </button>
          </div>
          <div>
            <button
              className="improvement-button"
              onClick={handleProjectClick}
              style={{
                backgroundColor: 'lightblue',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '6px',
                marginBottom: '15px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = 'darkblue')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'lightblue')}
            >
              Signal for Improvement
            </button>
            <h2>Leave a Suggestion</h2>
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  marginBottom: '15px',
                }}
              >
                <label
                  htmlFor="name"
                  style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: 'bold',
                  }}
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  required
                  style={{
                    width: '85%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    fontSize: '16px',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'blue';
                    e.target.style.boxShadow = '0 0 5px rgba(0, 0, 255, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div
                style={{
                  marginBottom: '15px',
                }}
              >
                <label
                  htmlFor="suggestion"
                  style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: 'bold',
                  }}
                >
                  Suggestion
                </label>
                <textarea
                  id="suggestion"
                  name="suggestion"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Your suggestion"
                  required
                  style={{
                    width: '85%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    fontSize: '16px',
                    resize: 'none',
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: 'lightblue',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease, transform 0.2s ease',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = 'darkblue')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'lightblue')}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
