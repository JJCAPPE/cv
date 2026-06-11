const focus = [
  "Software / AI internship search for Summer 2027",
  "ML research in rowing biomechanics and human motion understanding",
  "Building clean full-stack systems with TypeScript, Python, Rust, and Postgres",
];

export function StatusBlock() {
  return (
    <div className="status-block">
      <p className="status-block__label">Currently</p>
      <ul>
        {focus.map((item) => (
          <li key={item}>
            <span aria-hidden="true">&gt;</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
