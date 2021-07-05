async function getPullRequest(source, target, state) {
    var existingPr = github.pulls.list({
        owner: context.repo.owner,
        repo: context.repo.repo,
        state: state,
        head: source,
        base: target
    });
    return existingPr;
}

async function createPullRequest(title, source, target) {
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

var existingPullRequest = await getPullRequest("master", "testing", "open")
if (existingPullRequest.data.length) {
    console.log("PR already present");
}
else {
    await createPullRequest("Master -> Testing", "master", "testing")
}
