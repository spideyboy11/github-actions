module.exports = async ({github, context, core}) => {

    async function getPull(source, target, state) {
        var existingPr = await github.pulls.list({
            owner: context.repo.owner,
            repo: context.repo.repo,
            state: state,
            head: source,
            base: target
        });
        return existingPr;
    }

    async function createPull(title, source, target) {
        try {
            var newPr = await github.pulls.create({
                title: title,
                owner: context.repo.owner,
                repo: context.repo.repo,
                head: source,
                base: target
            });
        } catch (error) {
            console.log(error.errors);
        }
    }
    console.log(github.ref);
    if (github.ref == 'refs/heads/testing') {
        var existingPr = await getPull("testing", "staging", "open");
        if (existingPr.data.length) {
            console.log("Testing -> Staging PR already created");
        } else {
            await createPull("Testing -> Staging", "testing", "staging");
        }
    }

    if (github.ref == 'refs/heads/staging') {
        var existingPr = await getPull("staging", "release", "open");
        if (existingPr.data.length) {
            console.log("Staging -> Release PR already created");
        } else {
            await createPull("Staging -> Release", "staging", "release");
        }
    }
}
