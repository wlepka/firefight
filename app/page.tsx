interface FireData {
  lat: number;
  lng: number;
  detectedAt: string;
  confidence?: string;
  fwi?: number;
  fireType: string;
  fireCategory?: string;
  fireName?: string;
  areaBurnt?: number;
}

async function fetchFireData() {
  const apiKey = '8175d58dd429515fa2f606243bdccf79db8cbbade96356075ef990aec5eb091b';

  const detectedResponse = await fetch('https://api.ambeedata.com/fire/latest/by-place?place=California', {
    headers: {
      'x-api-key': apiKey!,
      'Content-Type': 'application/json',
    },
  });

  const detectedData = await detectedResponse.json();

  const reportedResponse = await fetch('https://api.ambeedata.com/fire/reported/by-place?place=California', {
    headers: {
      'x-api-key': apiKey!,
      'Content-Type': 'application/json',
    },
  });

  const reportedData = await reportedResponse.json();

  return { detectedFires: detectedData?.data || [], reportedFires: reportedData?.data || [] };
}

export default async function Home() {
  const { detectedFires, reportedFires } = await fetchFireData();

  // Function to set background color based on fire confidence
  const getConfidenceColor = (confidence?: string) => {
    switch (confidence) {
      case 'high':
        return 'bg-red-500 text-white'; // High confidence fires: Red
      case 'nominal':
        return 'bg-yellow-500 text-white'; // Nominal confidence fires: Yellow
      default:
        return 'bg-gray-200 text-black'; // Default color: Gray
    }
  };

  // Function to set background color based on fire type
  const getFireTypeColor = (fireType: string) => {
    if (fireType === 'reported') {
      return 'bg-blue-500 text-white'; // Reported fires: Blue
    } else {
      return 'bg-green-500 text-white'; // Detected fires: Green
    }
  };

  return (
    <div className="min-h-screen p-8 pb-20 font-sans">
      <main className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8">California Fire Data</h1>

        {/* Detected Fires Section */}
        <section className="mb-16 w-full">
          <h2 className="text-2xl font-semibold mb-4">Detected Fires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {detectedFires.length > 0 ? (
              detectedFires.map((fire: FireData, index: number) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg shadow-md ${getConfidenceColor(fire.confidence)}`}
                >
                  <h3 className="font-bold">Fire at Lat: {fire.lat}, Lng: {fire.lng}</h3>
                  <p>Detected At: {new Date(fire.detectedAt).toLocaleString()}</p>
                  <p>Confidence: {fire.confidence || 'N/A'}</p>
                  <p>FWI: {fire.fwi || 'N/A'}</p>
                  <p>Fire Type: {fire.fireType}</p>
                  <p>Fire Category: {fire.fireCategory || 'N/A'}</p>
                </div>
              ))
            ) : (
              <p>No detected fires found.</p>
            )}
          </div>
        </section>

        {/* Reported Fires Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Reported Fires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportedFires.length > 0 ? (
              reportedFires.map((fire: FireData, index: number) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg shadow-md ${getFireTypeColor(fire.fireType)}`}
                >
                  <h3 className="font-bold">Fire Name: {fire.fireName}</h3>
                  <p>Detected At: {new Date(fire.detectedAt).toLocaleString()}</p>
                  <p>Area Burnt: {fire.areaBurnt || 'N/A'} acres</p>
                  <p>FWI: {fire.fwi || 'N/A'}</p>
                  <p>Fire Type: {fire.fireType}</p>
                </div>
              ))
            ) : (
              <p>No reported fires found.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}