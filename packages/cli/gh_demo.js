var GitHubApi = require("github");

var github = new GitHubApi({
    version: '3.0.0',
});

main();

function main() {
    github.repos.getArchiveLink({
        user: 'antwarjs',
        repo: 'boilerplate',
        'archive_format': 'tarball',
        ref: 'master',
    }, function(err, res) {
        if(err) {
            return console.error(err);
        }

        var location = res.meta.location;
    });
}
