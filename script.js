const query = `
query UpcomingOnlineSSBU {
  tournaments(
    query: {
      perPage: 10
      filter: {
        upcoming: true
        videogameIds: [1386]  # Smash Ultimate’s Game ID
        isOnline: true
      }
    }
  ) {
    nodes {
      name
      slug
      startAt
      numAttendees
      owner {
        name
      }
    }
  }
}
`;

document.getElementById("loadTournaments").addEventListener("click", async () => {
  const token = document.getElementById("apiToken").value.trim();
  const status = document.getElementById("status");
  const tournamentsContainer = document.getElementById("tournaments");

  if (!token) {
    status.textContent = "Please enter your Start.gg API token.";
    return;
  }

  status.textContent = "Loading tournaments...";

  try {
    const response = await fetch("https://api.start.gg/gql/alpha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    const tournaments = data.data.tournaments.nodes;

    tournamentsContainer.innerHTML = "";
    if (tournaments.length === 0) {
      tournamentsContainer.innerHTML = "<p>No upcoming online tournaments found.</p>";
    } else {
      tournaments.forEach(t => {
        const date = new Date(t.startAt * 1000).toLocaleDateString();
        const item = document.createElement("div");
        item.classList.add("tournament");
        item.innerHTML = `
          <h2><a href="https://start.gg/${t.slug}" target="_blank">${t.name}</a></h2>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Attendees:</strong> ${t.numAttendees}</p>
          <p><strong>Organizer:</strong> ${t.owner?.name || "Unknown"}</p>
        `;
        tournamentsContainer.appendChild(item);
      });
    }

    status.textContent = "";
  } catch (error) {
    console.error(error);
    status.textContent = "Error loading tournaments.";
  }
});
