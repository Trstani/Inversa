fetch('http://localhost:5000/api/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: "Project Test 1",
    description: "Ini dari backend test",
    initiator_id: 5   // 👈 HARUS ID USER YANG ADA
  })
})
.then(res => res.json())
.then(console.log)
.catch(console.error);