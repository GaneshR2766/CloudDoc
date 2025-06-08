import { useState, useEffect } from 'react';
import axios from 'axios';
import shareIcon from "../assets/share.png";
import eyeIcon from "../assets/eye.png";
import recycleBinIcon from "../assets/recycle-bin.png";
import shareFolderIcon from "../assets/sharefolder.png";
import cancelIcon from "../assets/cancel.png";
import imageIcon from "../assets/image.png";
import videoIcon from "../assets/video.png";
import wordpdfIcon from "../assets/wordpdf.png";
import audioIcon from "../assets/audio.png";
import zipIcon from "../assets/zip.png";
import otherdocIcon from "../assets/otherdoc.png";

function FileList({ refreshKey, token, username }) {  // Added username prop
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  const [shareMsg, setShareMsg] = useState('');
  const [totalSize, setTotalSize] = useState(0);

  const maxGB = 15;

  const fetchFiles = () => {
    axios
      .get('https://cloud-doc-backend-977589759806.us-central1.run.app/files', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const fetched = response.data.files || [];
        setFiles(fetched);
        setMessage(fetched.length ? '' : 'No files found');

        // Memory usage calc
        const totalKB = fetched.reduce((sum, file) => sum + parseFloat(file.size || 0), 0);
        const totalUsedGB = totalKB / (1024 * 1024);
        setTotalSize(totalUsedGB);
      })
      .catch(() => {
        setFiles([]);
        setMessage('Failed to fetch files');
      });
  };

  const getIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return imageIcon;
    if (['mp4', 'mkv', 'avi', 'mov'].includes(ext)) return videoIcon;
    if (['pdf', 'doc','txt', 'docx'].includes(ext)) return wordpdfIcon;
    if (['mp3', 'wav'].includes(ext)) return audioIcon;
    if (['zip', 'rar', '7z'].includes(ext)) return zipIcon;
    return otherdocIcon;
  };

  const downloadFile = (file) => {
    if (file.url) window.open(file.url, '_blank');
    else alert('No download URL available');
  };

const previewFile = (file) => {
  const query = file.owner && file.owner !== 'undefined' 
    ? `?owner=${encodeURIComponent(file.owner)}` 
    : '';

  axios
    .get(`https://cloud-doc-backend-977589759806.us-central1.run.app/preview/${encodeURIComponent(file.name)}${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const previewUrl = res.data.url;
      window.open(previewUrl, '_blank');
    })
    .catch(() => alert('Failed to generate preview link'));
};




  const deleteFile = (filename) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"?`)) return;
    axios
      .delete(`https://cloud-doc-backend-977589759806.us-central1.run.app/files/${encodeURIComponent(filename)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(fetchFiles)
      .catch(() => alert('Delete failed'));
  };

  const clearAccesses = () => {
    if (!window.confirm('Are you sure you want to clear all shared accesses?')) return;
    axios
      .delete('https://cloud-doc-backend-977589759806.us-central1.run.app/clear-shared-accesses', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => alert(res.data.message))
      .catch(() => alert('Failed to clear shared accesses'));
  };

  const shareFile = (file) => {
    if (file.url) {
      navigator.clipboard.writeText(file.url);
      alert('Share Link copied to clipboard!\nLink will expire in 15 minutes');
    } else alert('Failed to generate shareable link');
  };

  const shareFolder = () => {
    if (!shareEmail.trim()) {
      setShareMsg('Please enter a valid email');
      return;
    }
    axios
      .post(
        'https://cloud-doc-backend-977589759806.us-central1.run.app/share-folder',
        { shared_with_email: shareEmail.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => setShareMsg(res.data.message || 'Folder shared'))
      .catch((err) => {
        const msg = err.response?.data?.error || 'Failed to share';
        setShareMsg(msg);
      });
  };

  useEffect(() => {
    if (token) fetchFiles();
  }, [token, refreshKey]);

  const percentUsed = Math.min(100, (totalSize / maxGB) * 100).toFixed(2);

return (
  <div style={{ textAlign: 'center', padding: '1rem' }}>
    {/* Welcome message */}
    {username && (
      <h2 style={{ marginBottom: '0.25rem'}}>
        Welcome, <span style={{ color: '#038ee3' }}>{username}</span>! 😊
      </h2>
    )}

    {/* Headings */}
    <h3 style={{ marginBottom: '1rem', color: '#888' }}>Your Files are Safe here.</h3>
<h4 style={{ marginBottom: '1rem', color: '#777' }}>
  Scroll down to access your files<br />
  To download your files click them
</h4>

    {/* Memory Usage Bar */}
    <div
      style={{
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto', // ✅ Center the bar itself
        backgroundColor: '#eee',
        borderRadius: '12px',
        overflow: 'hidden',
        height: '20px',
        marginBottom: '1.5rem',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
      }}
      aria-label="Memory usage"
      role="progressbar"
      aria-valuenow={totalSize}
      aria-valuemin={0}
      aria-valuemax={maxGB}
    >
      <div
        style={{
          width: `${percentUsed}%`,
          height: '100%',
          background: `linear-gradient(90deg, #7B3FF2, #5200d6)`,
          transition: 'width 0.5s ease',
        }}
      />
    </div>

    {/* Memory Usage Text */}
    <p style={{ marginTop: '-1rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#999' }}>
      {totalSize.toFixed(2)} GB used of {maxGB} GB
    </p>

{/* Share Folder UI */}
<div style={{ marginBottom: '1.5rem' }}>
  <style>
    {`
      @keyframes glowPulse {
        0%, 100% {
          box-shadow: 0 0 8px 2px rgba(0, 191, 166, 0.8);
        }
        50% {
          box-shadow: 0 0 16px 6px rgba(0, 191, 166, 1);
        }
      }
    `}
  </style>

  <input
    type="email"
    placeholder="Enter others' email to share your folder"
    value={shareEmail}
    onChange={(e) => setShareEmail(e.target.value.toLowerCase())}
    style={{
      padding: '0.59rem 0.75rem',
      borderRadius: '6px',
      border: '2px solid #00bfa6',
      outline: 'none',
      marginRight: '0.5rem',
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      boxShadow: '0 0 6px rgba(0, 191, 166, 0.4)',
      fontSize: '1rem',
      width: '280px',
    }}
    onFocus={e => {
      e.currentTarget.style.borderColor = '#009f8c';
      e.currentTarget.style.boxShadow = '0 0 10px 2px rgba(0, 159, 140, 0.7)';
    }}
    onBlur={e => {
      e.currentTarget.style.borderColor = '#00bfa6';
      e.currentTarget.style.boxShadow = '0 0 6px rgba(0, 191, 166, 0.4)';
    }}
  />

  <button
    onClick={shareFolder}
    style={{
      padding: '0.5rem 0.75rem',
      marginLeft: '0.5rem',
      background: 'linear-gradient(90deg, #00bfa6 0%, #009f8c 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: '0 0 8px 2px rgba(0, 191, 166, 0.8)',
      transition: 'background 0.3s ease, box-shadow 0.6s ease-in-out',
      animation: 'glowPulse 2.5s ease-in-out infinite',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = 'linear-gradient(90deg, #009f8c 0%, #00bfa6 100%)';
      e.currentTarget.style.boxShadow = '0 0 12px 4px rgba(0, 191, 166, 1)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = 'linear-gradient(90deg, #00bfa6 0%, #009f8c 100%)';
      e.currentTarget.style.boxShadow = '0 0 8px 2px rgba(0, 191, 166, 0.8)';
    }}
  >
    Share Folder{' '}
    <img
      src={shareFolderIcon}
      alt="Share Folder"
      style={{ marginBottom: '-0.2rem', marginLeft: '0.3rem', width: '18px', height: '18px' }}
    />
  </button>

  {shareMsg && <p style={{ marginTop: '0.5rem', color: '#555' }}>{shareMsg}</p>}
</div>


      {/* Clear All Shared Accesses Button */}
      <button
        onClick={clearAccesses}
        style={{
          marginBottom: '1.5rem',
          background: 'linear-gradient(90deg, #ff4d4d 0%, #cc0000 100%)', // red gradient
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 0 8px 2px rgba(255, 77, 77, 0.8)', // red glow
          transition: 'background 0.3s ease, box-shadow 0.6s ease-in-out',
          animation: 'glowPulseRed 2.5s ease-in-out infinite',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'linear-gradient(90deg, #cc0000 0%, #ff4d4d 100%)';
          e.currentTarget.style.boxShadow = '0 0 12px 4px rgba(255, 77, 77, 1)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'linear-gradient(90deg, #ff4d4d 0%, #cc0000 100%)';
          e.currentTarget.style.boxShadow = '0 0 8px 2px rgba(255, 77, 77, 0.8)';
        }}
      >
        Clear All Shared Accesses
        <img
          src={cancelIcon}
          alt="Cancel"
          style={{ marginLeft: '0.5rem', marginTop: '0.1rem', width: '18px', height: '18px' }}
        />
      </button>

      <style>
        {`
        @keyframes glowPulseRed {
          0%, 100% {
            box-shadow: 0 0 8px 2px rgba(255, 77, 77, 0.8);
          }
          50% {
            box-shadow: 0 0 16px 6px rgba(255, 77, 77, 1);
          }
        }
        `}
      </style>

      {/* File list */}
      {files.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {files.map((f) => (
            <li
              key={f.name}
              style={{
                marginBottom: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem',
                border: '1px solid #eee',
                borderRadius: '8px',
                cursor: 'default',
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f0f8ff'; // light blue bg on hover
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.3)';
                e.currentTarget.style.cursor = 'pointer'; // pointer cursor on hover
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.boxShadow = '';
                e.currentTarget.style.cursor = 'default';
              }}
            >
              <span
                style={{ cursor: 'pointer', flex: 1, display: 'flex', alignItems: 'center' }}
                onClick={() => downloadFile(f)}  // —UPDATED: pass the full file object
                title="Click to download"
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#1890ff'; // blue text on hover
                  const img = e.currentTarget.querySelector('img');
                  if (img) {
                    img.style.filter = 'brightness(1.2)'; // brighten icon
                    img.style.transform = 'scale(1.1)';   // scale up icon
                    img.style.transition = 'transform 0.3s ease, filter 0.3s ease';
                  }
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '';
                  const img = e.currentTarget.querySelector('img');
                  if (img) {
                    img.style.filter = '';
                    img.style.transform = '';
                  }
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                <img
                  src={getIcon(f.name)}
                  alt="file icon"
                  style={{ width: '20px', height: '20px', verticalAlign: 'middle', marginRight: '8px' }}
                />
                <strong style={{ color: 'grey' }}>{f.name}</strong>
              </span>

              <span style={{ color: '#666', fontSize: '0.9rem', marginRight: '1rem' }}>
                {f.size} KB • {f.modified}
              </span>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
<button
  onClick={() => previewFile(f)}
  style={{
    padding: '0.35rem 0.7rem',
    background: 'linear-gradient(145deg, #00b4d8, #0077b6)', // soft cyan gradient
    color: '#fff',
    border: '1px solid #0077b6',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'background 0.3s ease, transform 0.2s ease',
    boxShadow: 'inset 0 0 0 transparent', // no glow
  }}
  onMouseEnter={e => {
    e.currentTarget.style.background = 'linear-gradient(145deg, #0096c7, #005f73)';
    e.currentTarget.style.transform = 'translateY(-1px)';
  }}
  onMouseLeave={e => {
    e.currentTarget.style.background = 'linear-gradient(145deg, #00b4d8, #0077b6)';
    e.currentTarget.style.transform = 'translateY(0)';
  }}
>
  <img src={eyeIcon} alt="Preview" style={{ width: '16px', height: '16px' }} />
  Preview
</button>


                <button
  onClick={() => shareFile(f)}
  style={{
    padding: '0.35rem 0.7rem',
    background: 'linear-gradient(145deg, #52c41a, #389e0d)',  // vibrant green gradient
    color: '#fff',
    border: '1px solid #389e0d',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'background 0.3s ease, transform 0.2s ease',
    boxShadow: 'inset 0 0 0 transparent',
  }}
  onMouseEnter={e => {
    e.currentTarget.style.background = 'linear-gradient(145deg, #46b014, #2e7d0b)';
    e.currentTarget.style.transform = 'translateY(-1px)';
  }}
  onMouseLeave={e => {
    e.currentTarget.style.background = 'linear-gradient(145deg, #52c41a, #389e0d)';
    e.currentTarget.style.transform = 'translateY(0)';
  }}
>
  <img src={shareIcon} alt="Share" style={{ width: '16px', height: '16px' }} />
  Share
</button>


                <button 
  onClick={() => deleteFile(f.name)}
  style={{
    padding: '0.35rem 0.7rem',
    background: 'linear-gradient(145deg, #ff4d4f, #d9363e)',  // warm red gradient
    color: '#fff',
    border: '1px solid #d9363e',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'background 0.3s ease, transform 0.2s ease',
    boxShadow: 'inset 0 0 0 transparent',  // no glow
  }}
  onMouseEnter={e => {
    e.currentTarget.style.background = 'linear-gradient(145deg, #e53945, #b92c33)';
    e.currentTarget.style.transform = 'translateY(-1px)';
  }}
  onMouseLeave={e => {
    e.currentTarget.style.background = 'linear-gradient(145deg, #ff4d4f, #d9363e)';
    e.currentTarget.style.transform = 'translateY(0)';
  }}
>
  <img src={recycleBinIcon} alt="Delete" style={{ width: '16px', height: '16px' }} />
  Delete
</button>

              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: '#999' }}>{message || 'Loading files...'}</p>
      )}
    </div>
  );
}

export default FileList;
