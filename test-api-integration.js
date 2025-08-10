// Test script to verify API integration
// Run this in the browser console or as a Node.js script

const API_BASE_URL = 'http://localhost:5000';

async function testApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('Health check:', data);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}

async function testMatchApi() {
  try {
    const payload = {
      title: "Software Engineer",
      description: "We are looking for a software engineer with experience in JavaScript and React.",
      skills: ["JavaScript", "React", "Node.js"],
      top_k: 5
    };

    const response = await fetch(`${API_BASE_URL}/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('Match API response:', data);
    return data.status === 'success';
  } catch (error) {
    console.error('Match API failed:', error);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing API Integration...');
  
  console.log('\n1. Testing API Health...');
  const healthOk = await testApiHealth();
  
  if (healthOk) {
    console.log('✅ API is healthy');
    
    console.log('\n2. Testing Match API...');
    const matchOk = await testMatchApi();
    
    if (matchOk) {
      console.log('✅ Match API is working');
      console.log('\n🎉 All tests passed! The API integration is ready.');
    } else {
      console.log('❌ Match API failed');
    }
  } else {
    console.log('❌ API health check failed');
    console.log('\n💡 Make sure the Flask API is running on localhost:5000');
  }
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  runTests();
} else {
  // Browser environment
  console.log('Run runTests() in the console to test the API integration');
}
