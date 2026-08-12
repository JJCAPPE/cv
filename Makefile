RESUME_PDFS := \
	resume-master.pdf \
	resume-giacomo-cappelletto.pdf \
	resume-swe-infrastructure.pdf \
	resume-ai-ml.pdf \
	resume-quant-finance.pdf \
	resume-data-systems.pdf \
	resume-cv-multimodal.pdf \
	resume-devtools-agents.pdf

.PHONY: resumes clean list-resumes

resumes:
	./scripts/compile-resumes.sh

list-resumes:
	@printf '%s\n' $(RESUME_PDFS)

clean:
	rm -rf .resume-build
	rm -f $(RESUME_PDFS)
