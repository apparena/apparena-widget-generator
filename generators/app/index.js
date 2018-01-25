'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const parseAuthor = require('parse-author');
var path = require('path');
var _ = require('lodash');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    this.option('travis', {
      type: Boolean,
      required: false,
      defaults: true,
      desc: 'Include travis config'
    });

    this.option('license', {
      type: Boolean,
      required: false,
      defaults: true,
      desc: 'Include a license'
    });

    this.option('name', {
      type: String,
      required: false,
      desc: 'Project name'
    });

    this.option('githubAccount', {
      type: String,
      required: false,
      desc: 'GitHub username or organization'
    });

    this.option('projectRoot', {
      type: String,
      required: false,
      defaults: 'server',
      desc: 'Relative path to the project code root'
    });

    this.option('readme', {
      type: String,
      required: false,
      desc: 'Content to insert in the README.md file'
    });
  }

  initializing() {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    if (this.pkg.keywords) {
      this.pkg.keywords = this.pkg.keywords.filter(x => x);
    }

    // Pre set the default props from the information we have at this point
    this.props = {
      name: this.pkg.name,
      description: this.pkg.description,
      version: this.pkg.version,
      homepage: this.pkg.homepage
    };

    if (_.isObject(this.pkg.author)) {
      this.props.authorName = this.pkg.author.name;
      this.props.authorEmail = this.pkg.author.email;
      this.props.authorUrl = this.pkg.author.url;
      this.props.createDirectory = false;
    } else if (_.isString(this.pkg.author)) {
      var info = parseAuthor(this.pkg.author);
      this.props.authorName = info.name;
      this.props.authorEmail = info.email;
      this.props.authorUrl = info.url;
    }
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the ' + chalk.red('apparena-widget') + ' generator!'));

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Application Name',
        when: !this.props.name,
        default: path.basename(process.cwd())
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description',
        when: !this.props.description
      },
      {
        type: 'input',
        name: 'homepage',
        message: 'Project homepage url',
        when: !this.props.homepage
      },
      {
        type: 'input',
        name: 'authorName',
        message: "Author's Name",
        when: !this.props.authorName,
        default: this.user.git.name(),
        store: true
      },
      {
        type: 'input',
        name: 'authorEmail',
        message: "Author's Email",
        when: !this.props.authorEmail,
        default: this.user.git.email(),
        store: true
      },
      {
        type: 'input',
        name: 'authorUrl',
        message: "Author's Homepage",
        when: !this.props.authorUrl,
        store: true
      },
      {
        type: 'input',
        name: 'keywords',
        message: 'Package keywords (comma to split)',
        when: _.isEmpty(this.pkg.keywords),
        filter: function(words) {
          return words.split(/\s*,\s*/g).filter(x => x);
        }
      },
      {
        type: 'confirm',
        name: 'createDirectory',
        message: 'Would you like to create a new directory for your project?',
        when: this.props.createDirectory === undefined,
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = _.merge(this.props, props);
      if (this.props.createDirectory) {
        var newRoot =
          this.destinationPath() + '/' + _.kebabCase(_.deburr(this.props.name));
        this.destinationRoot(newRoot);
      }
    });
  }

  writing() {
    // Re-read the content at this point because a composed generator might modify it.
    var currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    const _pkg = '_package.json';

    this.fs.copyTpl(this.templatePath(_pkg), this.destinationPath(_pkg), {});

    var defaultPkg = this.fs.readJSON(this.destinationPath(_pkg));
    this.fs.delete(this.destinationPath(_pkg));

    ['name', 'version', 'description', 'homepage', 'main', 'license'].forEach(x => {
      currentPkg[x] = currentPkg[x] || undefined;
    });

    var updatePkg = _.defaultsDeep(currentPkg, {
      name: _.kebabCase(this.props.name),
      version: '0.0.1',
      description: this.props.description,
      homepage: this.props.homepage,
      author: {
        name: this.props.authorName,
        email: this.props.authorEmail,
        url: this.props.authorUrl
      },
      files: [this.options.projectRoot],
      dependencies: {},
      main: path.join(this.options.projectRoot, 'index.js').replace(/\\/g, '/'),
      keywords: []
    });

    var pkg = _.merge({}, defaultPkg, updatePkg);

    // Combine the keywords
    if (this.props.keywords) {
      pkg.keywords = _.uniq(this.props.keywords.concat(pkg.keywords)).filter(x => x);
    }

    const sortDep = dep => {
      if (typeof pkg[dep] === 'object') {
        pkg[dep] = _.pick(pkg[dep], Object.keys(pkg[dep]).sort());
      }
    };

    [
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies'
    ].forEach(sortDep);

    // Let's extend package.json so we're not overwriting user previous fields
    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

    this.fs.copy(this.templatePath('index.html'), this.destinationPath('index.html'));

    this.fs.copy(this.templatePath('build'), this.destinationPath('build'));

    this.fs.copy(this.templatePath('README.md'), this.destinationPath('README.md'));

    this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));

    this.fs.copy(this.templatePath('src'), this.destinationPath('src'));

    this.fs.copy(this.templatePath('__tests__'), this.destinationPath('__tests__'));
  }

  install() {
    this.installDependencies({
      bower: false,
      npm: true,
      yarn: true
    });
  }

  end() {
    var chdir = this.props.createDirectory
      ? "'cd " + _.kebabCase(_.deburr(this.props.name)) + "' then "
      : '';
    this.log(
      '\n' +
        chalk.green.underline('Your new App-Arena Widget is ready!') +
        '\n' +
        '\nType ' +
        chdir +
        "'yarn start' to start developing." +
        '\n'
    );
  }
};
