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

    var sourceBranch = null;
    var targetBranch = null;

    if (context.ref == 'refs/heads/testing') {
        var existingPr = await getPull("testing", "staging", "open");
        if (existingPr.data.length) {
            console.log("Testing -> Staging PR already created");
        } else {
            sourceBranch = "testing";
            targetBranch = "staging";
        }
    }

    if (context.ref == 'refs/heads/staging') {
        var existingPr = await getPull("staging", "release", "open");
        if (existingPr.data.length) {
            console.log("Staging -> Release PR already created");
        } else {
            sourceBranch = "staging";
            targetBranch = "release";
        }
    }

    if (sourceBranch && targetBranch) {
        await createPull("Staging -> Release", "staging", "release");
    }
}
