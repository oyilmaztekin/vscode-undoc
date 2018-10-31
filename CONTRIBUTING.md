Pull Requests
-------------

If you're thinking about making some changes, maybe fixing a bug, or adding a
new feature, first, thank you.  Contributions are always welcome.
So below you'll find  **The fastest way to get your pull request merged in.**  

1. **Create your change branch**
   Once you are in ```<tracking branch>```, make sure it's up to date, then create
   a branch for your changes off of that one.

        git branch fix/issue-395
        git checkout fix/issue-395
        git branch feature/issue-395
        git checkout feature/issue-395

   Here 'fix/issue-395' is the name of the branch.  Feel free to use whatever
   you want.  We'll call this the ```<change branch>```.  This is the branch that
   you will eventually issue your pull request from.

   The purpose of these first three steps is to make sure that your merge request
   has a nice clean diff that only involves the changes related to your fix/feature.

2. **Make your changes**
   On your ```<change branch>``` make any changes relevant to your fix/feature.  Don't
   group fixes for multiple unrelated issues or multiple unrelated features together.
   Create a separate branch for each unrelated changeset.  For instance, if you're
   fixing a bug in the parser and adding some new markdown to the readme, those
   should be separate branches and merge requests.

3. **Add tests**
   Add tests for your change.  If you are submitting a bugfix, include a test that
   verifies the existence of the bug along with your fix.  If you are submitting
   a new feature, include tests that verify proper feature function, if applicable.
   See the readme in the 'test' directory for more information

4. **Commit and publish**
   Commit your changes and publish your branch (or push it if it's already published)

5. **Issue your pull request**
   On github.com, switch to your ```<change branch>``` and click the 'Pull Request'
   button.  Enter some meaningful information about the pull request.  If it's a bugfix,
   that doesn't already have an issue associated with it, provide some info on what
   situations that bug occurs in and a sense of it's severity.  If it does already have
   an issue, make sure the include the hash and issue number (e.g. '#100') so github
   links it.

   If it's a feature, provide some context about the motivations behind the feature,
   why it's important/useful/cool/necessary and what it does/how it works.  Don't
   worry about being too verbose. Folks will be much more amenable to reading through
   your code if they know what its supposed to be about.