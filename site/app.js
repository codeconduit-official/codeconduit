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

const form = document.getElementById('brief-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const name = values.get('name').trim();
  const email = values.get('email').trim();
  const project = values.get('project').trim();
  if (!name || !project) {
    document.getElementById('form-status').textContent = 'Please add your name and a short project description.';
    return;
  }
  const subject = `CodeConduit project inquiry: ${values.get('service')}`;
  const body = `Hi Clint,\n\nI’d like to discuss a project.\n\nName: ${name}\nEmail: ${email}\nInterested in: ${values.get('service')}\n\n${project}\n\nThanks,\n${name}`;
  document.getElementById('prepared-brief').value = `${subject}\n\n${body}`;
  document.getElementById('brief-fallback').hidden = false;
  document.getElementById('form-status').textContent = 'Your draft is ready. Review and send it in your email app, or copy it below.';
  window.location.href = `mailto:Clint@codeconduit.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.getElementById('copy-brief').addEventListener('click', async () => {
  const brief = document.getElementById('prepared-brief');
  try {
    await navigator.clipboard.writeText(brief.value);
    document.getElementById('form-status').textContent = 'Brief copied. Paste it into an email to Clint@codeconduit.com.';
  } catch {
    brief.focus();
    brief.select();
    document.getElementById('form-status').textContent = 'Select and copy the brief, then email it to Clint@codeconduit.com.';
  }
});

document.getElementById('prepare-email').disabled = false;

document.getElementById('year').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealing');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
}

