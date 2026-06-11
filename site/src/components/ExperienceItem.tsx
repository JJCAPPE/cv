import type { Experience } from "@/content/experience";

export function ExperienceItem({
  experience,
}: {
  experience: Experience;
}) {
  return (
    <article className="experience-item">
      <div className="experience-item__meta">
        <p>{experience.dates}</p>
        <p>{experience.location}</p>
      </div>
      <div>
        <h3>{experience.role}</h3>
        <p className="experience-item__organization">
          {experience.organization}
        </p>
        <ul className="plain-list">
          {experience.summary.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="stack-line">{experience.stack.join(" · ")}</p>
      </div>
    </article>
  );
}
