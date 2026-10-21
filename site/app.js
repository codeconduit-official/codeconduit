const scenarios = {
  admin: {
    friction: 'Someone copies information from a form into a spreadsheet, then sends the same email again.',
    connection: 'Capture the information once, apply your rules, update the right records, and send the notification automatically.'
  },
  tools: {
    friction: 'Customer details live in one tool, project updates in another. Your team fills the gap by hand.',
    connection: 'Connect the systems through their APIs so the right information reaches the right place without being retyped.'
  },
  deploy: {
    friction: 'Every release depends on a list of manual commands and someone remembering the right order.',
    connection: 'Create a repeatable pipeline to build, check, and deploy changes, with the approvals your environment needs.'
  },
  ai: {
    friction: 'You want AI agents to help with real work, but they cannot be trusted near client data.',
    connection: 'Give agents a purpose-built access layer, such as an MCP server with privacy filters, so they see only what they should.'
  }
};

document.querySelectorAll('[data-scenario]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-scenario]').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    const scenario = scenarios[button.dataset.scenario];
    document.getElementById('friction').textContent = scenario.friction;
    document.getElementById('connection').textContent = scenario.connection;
  });
});

const copyEmail = document.getElementById('copy-email');
const copyStatus = document.getElementById('copy-status');
if (navigator.clipboard) {
  copyEmail.hidden = false;
  copyEmail.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('project@codeconduit.com');
      copyStatus.textContent = 'Address copied.';
    } catch {
      copyStatus.textContent = 'Copy failed. The address is project@codeconduit.com.';
    }
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealing');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
}
