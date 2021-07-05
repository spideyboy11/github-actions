
module.exports = async ({github, context, core}) => {

    async function getPull(source, target, state) {
        var existingPr = github.pulls.list({
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

    var existingPr = await getPull("master", "testing", "open")
    if (existingPr.data.length) {
        console.log("PR already present");
    }
    else {
        await createPull("Master -> Testing", "master", "testing")
    }
}
