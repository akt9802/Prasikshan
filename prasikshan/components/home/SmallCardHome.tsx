'use client';

interface SmallCardHomeProps {
  name: string;
  title: string;
  text: string;
}

export default function SmallCardHome({ name, title, text }: SmallCardHomeProps) {
  return (
    <div
      className="hover-card"
      style={{
        height: '340px',
        width: '320px',
        backgroundColor: '#FFFFFF',
        borderRadius: '15px',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        backgroundImage: `
          radial-gradient(circle at 100% 100%, #f0f8ff 0, #f0f8ff 12.5%, transparent 12.5%),
          radial-gradient(circle at 0 100%, #f0f8ff 0, #f0f8ff 12.5%, transparent 12.5%),
          radial-gradient(circle at 100% 0, #f0f8ff 0, #f0f8ff 12.5%, transparent 12.5%),
          radial-gradient(circle at 0 0, #f0f8ff 0, #f0f8ff 12.5%, transparent 12.5%)
        `,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '20px 20px',
        backgroundPosition: '100% 100%, 0 100%, 100% 0, 0 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          paddingLeft: '40px',
          paddingTop: '20px',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#E0E0E0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
          }}
        >
          👤
        </div>
        <div>
          <h3 style={{ fontWeight: 'bolder', margin: '0' }} className="text-black">{name}</h3>
          <h6 style={{ margin: '0', fontSize: '14px', color: '#666' }}>{title}</h6>
        </div>
      </div>
      <div
        style={{
          paddingLeft: '30px',
          paddingRight: '20px',
          paddingTop: '20px',
          fontSize: '14px',
          color: '#333',
          lineHeight: '1.5',
        }}
      >
        {text}
      </div>

      <style>{`
        .hover-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
