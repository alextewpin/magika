var $ = require('jquery');
var React = require('react');
var Router = require('react-router');

var Route = Router.Route;
var Link = Router.Link;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Redirect = Router.Redirect;

var DATA_VERSION = 1;

var groupTitleMontersByCR = function(monster) {
	return 'Challenge ' + monster.cr;
}

var groupTitleSpellsByLevel = function(spell) {
	if (spell.level === 0) 
		return 'Cantrips';
	else 
		return 'Level ' + spell.level;
}

var checkNotFoundItem = function(keys, item) {
	if (keys[item])
		return keys[item]
	else
		return {name: item}
}

var App = React.createClass({
	toggleBookmarks: function(item, category, e) {
		e.preventDefault(); 
		var bookmarks = this.state.bookmarks;
		if (!bookmarks[category])
			bookmarks[category] = []

		var bmCategory = bookmarks[category];
		var index = bmCategory.indexOf(item);

		if (index === -1) {
			bmCategory.push(item);
			localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
			this.setState({
				bookmarks: bookmarks
			})
		}
		else {
			bmCategory.splice(index, 1);
			localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
			this.setState({
				bookmarks: bookmarks
			})
		}
	},
	getInitialState: function () {
		var bookmarksCategoies = ['classes', 'spellbook', 'bestiary']
		var mobile = false;
		if (!!('ontouchstart' in window))
			mobile = true;

		var bookmarks = {};
		var storedBookmarks = localStorage.getItem('bookmarks');
		if (storedBookmarks) 
			bookmarks = JSON.parse(storedBookmarks);

		for (var category in bookmarks) {
			if (bookmarksCategoies.indexOf(category) === -1)
				delete bookmarks[category];
		}

		bookmarksCategoies.forEach(function(category){
			if (!bookmarks[category])
				bookmarks[category] = [];
		})

		return {
			mobile: mobile,
			bookmarks: bookmarks
		};
	},
	render: function() {
		var output = null;
		if (true)
			output = <MobileLayout 
				toggleBookmarks={this.toggleBookmarks} 
				{...this.state}
			/>;
		else
			output = <DesktopLayout />;
		return output;
	}
})

var DesktopLayout = React.createClass({
	render: function() {
		return <div>Desktop Layout</div>
	}
})

var MobileLayout = React.createClass({
	render: function() {
		return (
			<div className='wrapper-mobile'>
				<RouteHandler {...this.props}/>
				<div className='footer-mobile'>
					<Likely />
					<Author />
				</div>
			</div>
		)
	}
})

var MobileNav = React.createClass({
	render: function() {
		var title;
		if (this.props.title)
			title = <span className='nav-title-mobile'>&nbsp;→ {this.props.title}</span>
		return (
			<div className='nav-mobile'>
				<div className='nav-breadcrumbs-mobile'>
					<div>
						<Link to='app' className='nav-logo-mobile'>Magika</Link>
						{title}
					</div>
				</div>
				<Link to='bookmarks' className='nav-bookmarks-mobile'>Bookmarks</Link>
			</div>
		)
	}
})

var MobileMainMenu = React.createClass({
	render: function() {
		return (
			<div>
				<MobileNav />
				<div className='content-wrapper-mobile'>
					<div className='list'>
						<Link to='classes' className='list-item-menu-mobile'>Classes</Link>
						<Link to='spellbook' className='list-item-menu-mobile'>Spellbook</Link>
						<Link to='bestiary' className='list-item-menu-mobile'>Bestiary</Link>
					</div>
				</div>
			</div>
		)
	}
})

var Likely = React.createClass({
	render: function() {
		return <div></div>
	}
})

var Author = React.createClass({
	render: function() {
		return <div className='author'>2015, <a href='https://twitter.com/alextewpin'>Alex Tewpin</a></div>
	}
})

var ClassesHandler = React.createClass({
	render: function() {
		return <ListLoader {...this.props} dataName='classes' />
	}
})

var SpellbookHandler = React.createClass({
	render: function() {
		return <ListLoader {...this.props} dataName='spellbook' />
	}
})

var BestiaryHandler = React.createClass({
	render: function() {
		return <ListLoader {...this.props} dataName='bestiary' />
	}
})

var Bookmarks = React.createClass({
	handleSearch: function(e) {
		this.setState({
			searchValue: e.target.value.toLowerCase()
		})
	},
	isBMEmpty: function(){
		return (this.props.bookmarks['classes'].length === 0 && this.props.bookmarks.spellbook.length === 0 && this.props.bookmarks.bestiary.length === 0)
	},
	sortBM: function (list) {
		return list.sort(function(a, b){
			var itemA = a.toLowerCase();
			var itemB = b.toLowerCase();
			if (itemA < itemB)
				return -1 
			if (itemA > itemB)
				return 1
			return 0
		});
	},
	groupBMClasses: function(classes) {
		output = [];
		output.push(this.sortBM(classes));
		return output;
	},
	groupBMMontersByCR: function(monsters) {
		monsters = this.sortBM(monsters);
		var monstersGrouped = [];
		for (i = 1; i <= 34; i++) {
			monstersGrouped.push([])
		}
		monsters.forEach(function(monster){
			monstersGrouped[this.state.data.MONSTERS_BY_KEY[monster].crNum].push(monster);
		}.bind(this))
		return monstersGrouped;
	},
	groupBMSpellsByLevel: function(spells) {
		spells = this.sortBM(spells);
		var spellsGrouped = [[],[],[],[],[],[],[],[],[],[]];
		spells.forEach(function(spell){
			spellsGrouped[this.state.data.SPELLS_BY_KEY[spell].level].push(spell);
		}.bind(this))
		return spellsGrouped;
	},
	getInitialState: function() {
		return {
			data: null,
			isReady: false,
			searchValue: ''
		}
	},
	componentDidMount: function () {
		if (!this.isBMEmpty()) {
			var dataNames = [];
			for (var dataName in this.props.bookmarks) {
				if (this.props.bookmarks[dataName].length > 0)
					dataNames.push(dataName);
			}
			
			dataNames = dataNames.map(function(dataName){
				var dataUrl = '/data/data-' + dataName + '.json';
				return $.get(dataUrl);
			})

			$.when.apply($, dataNames)
				.done(function(){
					var data = {};
					var args = [];
					if (dataNames.length === 1)
						args[0] = arguments;
					else
						args = Array.prototype.slice.call(arguments);
					args.forEach(function(argument){
						$.extend(data, argument[0])
					})
					this.setState({
						data: data,
						isReady: true
					})
				}.bind(this))
		}
	},
	render: function() {
		var output;
		if (this.state.isReady) {
			var BMClasses = this.groupBMClasses(this.props.bookmarks['classes']);
			var classGroups = [
				{
					groupTitleFc: null,
					group: BMClasses
				}
			]
			var BMSpellsByLevel = this.groupBMSpellsByLevel(this.props.bookmarks.spellbook);
			var spellGroups = [
				{
					groupTitleFc: groupTitleSpellsByLevel,
					group: BMSpellsByLevel
				}
			]
			var BMMontersByCR = this.groupBMMontersByCR(this.props.bookmarks.bestiary);
			var monsterGroups = [
				{
					groupTitleFc: groupTitleMontersByCR,
					group: BMMontersByCR
				}
			]
			output = <div>
				<ListSearch handleSearch={this.handleSearch} searchValue={this.state.searchValue} />
				<List
					title='Classes'
					dataName='classes'
					groups={classGroups}
					keys={this.state.data.CLASSES_BY_KEY}
					hideSubgroupLines={true}
					searchValue={this.state.searchValue}
					{...this.props}
				/>
				<List
					title='Spells'
					dataName='spellbook'
					groups={spellGroups}
					keys={this.state.data.SPELLS_BY_KEY}
					hideSubgroupLines={true}
					searchValue={this.state.searchValue}
					{...this.props}
				/>
				<List
					title='Monsters'
					dataName='bestiary'
					groups={monsterGroups}
					keys={this.state.data.MONSTERS_BY_KEY}
					hideSubgroupLines={true}
					searchValue={this.state.searchValue}
					{...this.props}
				/>
			</div>
		} else if (this.isBMEmpty()) {
			output = <NothingStub />
		} else {
			output = <LoadingStub/>
		}
		return (
			<div>
				<MobileNav title={this.props.dataName}/>
				{output}
			</div>
		)
	}
})

var ListLoader = React.createClass({
	handleSearch: function(e) {
		this.setState({
			searchValue: e.target.value.toLowerCase()
		})
	},
	getInitialState: function() {
		return {
			data: null,
			isReady: false,
			searchValue: ''
		}
	},
	componentDidMount: function () {
		var dataUrl = '/data/data-' + this.props.dataName + '.json'
		if (!this.props.isReady) {
			$.get(dataUrl, function(result) {
				this.setState({
					data: result,
					isReady: true
				});
			}.bind(this));
		}
	},
	render: function() {
		var output;
		if (this.state.isReady) {
			switch (this.props.dataName) {
				case 'classes':
					output = <Classes {...this.props} data={this.state.data} handleSearch={this.handleSearch} searchValue={this.state.searchValue} />;
					break;
				case 'spellbook':
					output = <Spellbook {...this.props} data={this.state.data} handleSearch={this.handleSearch} searchValue={this.state.searchValue} />;
					break;
				case 'bestiary':
					output = <Bestiary {...this.props} data={this.state.data} handleSearch={this.handleSearch} searchValue={this.state.searchValue}/>;
					break;
				default:
					output = null;
			}
		} else {
			output = <LoadingStub/>
		}
		return (
			<div>
				<MobileNav title={this.props.dataName}/>
				{output}
			</div>
		)
	}
})

var Classes = React.createClass({
	render: function() {
		var groups = [
			{
				group: this.props.data.CLASSES
			}
		]
		return (
			<div>
				<List
					groups={groups}
					keys={this.props.data.CLASSES_BY_KEY}
					{...this.props}
				/>
			</div>
		)
	}
})

var Spellbook = React.createClass({
	render: function() {
		var groups = [
			{
				groupTitleFc: groupTitleSpellsByLevel,
				group: this.props.data.SPELLS_GROUPED_BY_LEVEL
			}
		]
		return (
			<div>
				<ListSearch {...this.props} />
				<List
					filters={this.props.data.SPELLS_CHAR_FILTERS}
					filterLists={this.props.data.SPELLS_CHAR_FILTER_LISTS}
					groups={groups}
					keys={this.props.data.SPELLS_BY_KEY}
					{...this.props}
				/>
			</div>
		)
	}
})

var Bestiary = React.createClass({
	render: function() {
		var groups = [
			{
				groupTitleFc: groupTitleMontersByCR,
				group: this.props.data.MONSTERS_GROUPED_BY_CR
			}
		]
		return (
			<div>
				<ListSearch {...this.props} />
				<List 
					groups={groups}
					keys={this.props.data.MONSTERS_BY_KEY}
					{...this.props}
				/>
			</div>
		)
	}
})

var ListSearch = React.createClass({
	render: function() {
		return (
			<div className='list-search-wrapper'>
				<input className='list-search' onChange={this.props.handleSearch} value={this.props.searchValue} type='search' placeholder='Search'/>
			</div>
		)
	}
})

var List = React.createClass({
	handleFilterSelect: function(e) {
		var filter = e.target.value;
		localStorage.setItem(this.props.dataName + 'Filter', JSON.stringify(filter));
		this.setState({
			currentFilter: filter,
			currentList: this.props.filterLists[filter],
			itemsWithDescription: []
		})
	},
	handleSortSelect: function(e) {

	},
	toggleDescription: function(item) {
		var itemsWithDescription = this.state.itemsWithDescription;
		var index = itemsWithDescription.indexOf(item);

		if (index === -1) {
			itemsWithDescription.push(item)
			this.setState({
				itemsWithDescription: itemsWithDescription
			})
		} else {
			itemsWithDescription.splice(index, 1)
			this.setState({
				itemsWithDescription: itemsWithDescription
			})
		}
	},
	getInitialState: function () {
		var currentFilter = '';
		var currentList = [];

		if (this.props.filters) {
			var storedFilter = localStorage.getItem(this.props.dataName + 'Filter');
			if (storedFilter) 
				currentFilter = JSON.parse(storedFilter);
			else
				currentFilter = this.props.filters[0];
			currentList = this.props.filterLists[currentFilter];
		}

		return {
			currentFilter: currentFilter,
			currentList: currentList,
			currentGroup: this.props.groups[0],
			itemsWithDescription: []
		};
	},
	componentWillReceiveProps: function (nextProps) {
	    if (this.props.searchValue !== nextProps.searchValue)  {
	    	this.setState({
	    		itemsWithDescription: []
	    	})
	    }
	},
	render: function() {
		//Make filters
		var filterOptions;
		var filterSelect;
		
		if (this.props.filters) {
			filterOptions = this.props.filters.map(function(filter){
				return <option key={filter} value={filter}>{filter}</option>
			});
		}
		if (filterOptions) {
			filterSelect = <InlineSelect
				handleSelect={this.handleFilterSelect}
				currentOption={this.state.currentFilter}
				options={filterOptions} />
		}
		
		//Prepare filtered group
		var groupsFiltered;

		if (this.props.filters)
			groupsFiltered = this.state.currentList;
		else
			groupsFiltered = this.state.currentGroup.group;

		if (this.props.searchValue !== '') {
			var searchValue = this.props.searchValue.replace(' ', '_');
			groupsFiltered = groupsFiltered.map(function(group){
				return group.filter(function(item){
					return item.toLowerCase().indexOf(searchValue) !== -1;
				}, this)
			}, this)
		} 

		//Make title
		var title;
		var showTitle = false;

		if (this.props.title)
			groupsFiltered.forEach(function(group){
				if (group.length > 0)
					showTitle = true;
			})

		if (this.props.title && showTitle)
			title = <div className='list-block-title'>{this.props.title}</div>

		return (
			<div>
				<div className='content-wrapper-mobile'>
					{filterSelect}
					<div className="list">
						{title}
						{this.state.currentGroup.group.map(function(group, i){
							var groupFiltered = groupsFiltered[i];

							var groupClass = 'list-group'
							if (groupFiltered.length === 0)
								groupClass = groupClass + ' hideme'

							var groupTitle = ''
							if (group.length !== 0 && this.state.currentGroup.groupTitleFc)
								groupTitle = this.state.currentGroup.groupTitleFc(this.props.keys[group[0]]);

							var groupTitleElement = null
							if (groupTitle !== '')
								groupTitleElement = <div className='list-group-title'>{groupTitle}</div>

							return (
								<section className={groupClass} key={i}>
									{groupTitleElement}
									{group.map(function(itemUrl){
										var item = this.props.keys[itemUrl];

										var hidden = false;
										if (groupFiltered.indexOf(itemUrl) === -1)
											hidden = true;

										var bookmarked = false;
										if (this.props.bookmarks[this.props.dataName] && this.props.bookmarks[this.props.dataName].indexOf(itemUrl) !== -1)
											bookmarked = true;

										var showDescription = false;
										if (this.state.itemsWithDescription.indexOf(itemUrl) !== -1)
											showDescription = true;

										return (
											<ListItemWrapper hidden={hidden} bookmarked={bookmarked} showDescription={showDescription} key={itemUrl}>
												<ListItem 
													{...item}
													dataName={this.props.dataName}
													bookmarked={bookmarked}
													showDescription={showDescription}
													toggleDescription={this.toggleDescription}
													toggleBookmarks={this.props.toggleBookmarks} />
											</ListItemWrapper>
										)
									}, this)}
								</section>
							)
						}, this)}
					</div>
				</div>
			</div>
		)
	}
})

var ListItemWrapper = React.createClass({
	shouldComponentUpdate: function(nextProps) {
		return this.props.bookmarked !== nextProps.bookmarked || 
				this.props.hidden !== nextProps.hidden || 
				this.props.showDescription !== nextProps.showDescription;
	},
	render: function() {
		var wrapperClass = '';
		if (this.props.hidden === true)
			wrapperClass = 'hideme';
		return (
			<div className={wrapperClass}>
				{this.props.children}
			</div>
		)
	}
})

var ListItem = React.createClass({
	shouldComponentUpdate: function(nextProps) {
		return this.props.bookmarked !== nextProps.bookmarked || 
				this.props.showDescription !== nextProps.showDescription
	},
	render: function() {
		var bookmarksClass = 'list-item-bookmark mobile';
		if (this.props.bookmarked === true)
			bookmarksClass = bookmarksClass + ' selected';

		var item;
		var description;

		switch (this.props.dataName) {
			case 'classes':
				item = <ClassItem {...this.props} />
				if (this.props.showDescription)
					description = <ClassDescription {...this.props} />
				break;
			case 'spellbook':
				item = <SpellItem {...this.props} />
				if (this.props.showDescription)
					description = <SpellDescription {...this.props} />
				break;
			case 'bestiary':
				item = <MonsterItem {...this.props} />
				if (this.props.showDescription)
					description = <MonsterDescription {...this.props} />
				break;
			default:
				item = null;
				description = null;
		}

		return (
			<div className='list-item-wrapper'>
				<div className='list-item'>
					<div 
						className='list-item-link'
						onClick={this.props.toggleDescription.bind(null, this.props.url)}
					>{item}</div>
					<div 
						className={bookmarksClass} 
						onClick={this.props.toggleBookmarks.bind(null, this.props.url, this.props.dataName)}
					>★</div>
				</div>
				<div className='list-description'>{description}</div>
			</div>
		)
	}
})

var ClassItem = React.createClass({
	render: function() {
		return (
			<div className='list-item-content'>
				<div className='list-item-name'>{this.props.name}</div>
			</div>
		)
	}
})

var MonsterItem = React.createClass({
	render: function() {
		return (
			<div className='list-item-content'>
				<div className='list-item-name'>{this.props.name}</div>
				<div className='list-item-monster-type'>{this.props.typeShort}</div>
			</div>
		)
	}
})

var SpellItem = React.createClass({
	render: function() {
		iconClass = 'icon icon-school-' + this.props.school;

		var ritual;
		if (this.props.ritual)
			ritual = <div className='list-item-icon'>R</div>;

		var concentration;
		if (this.props.concentration)
			concentration = <div className='list-item-icon'>C</div>;
		else if (this.props.ritual)
			concentration = <div className='list-item-icon'></div>;

		var bookmarksClass = 'list-item-icon';
		if (this.props.bookmarked === true)
			bookmarksClass = bookmarksClass + ' selected';
		return (
			<div className='list-item-content'>
				<div className={iconClass}></div>
				<div className='list-item-name'>{this.props.name}</div>
				{ritual}
				{concentration}
			</div>
		)
	}
})

var Description = React.createClass({
	getInitialState: function() {
		return {
			data: null,
			isReady: false
		}
	},
	componentDidMount: function () {
		var url = '/data?' + this.props.dataName + '=' + this.props.itemUrl;
		$.get(url, function(result) {
			this.setState({
				data: result,
				isReady: true
			});
		}.bind(this));
	},
	render: function() {
		var output;
		var navBackLink;
		var navBackTitle;

		switch (this.props.dataName) {
			case 'spell':
				navBackLink = 'spellbook';
				navBackTitle = 'Spellbook';
				break;
		}

		if (this.state.isReady) {
			switch (this.props.dataName) {
				case 'spell':
					output = <SpellDescription {...this.state.data} />;
					break;
				default:
					output = <Wat />;
			}
		}

		return (
			<div>
				<MobileNav backLink={navBackLink} backTitle={navBackTitle}/>
				{output}
			</div>
		)
	}	
})

var ClassDescription = React.createClass({
	render: function() {
		var features = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]] //20
		features = features.map(function(level, i){
			var levelIndex = i + 1
			if (this.props.features[levelIndex]) {
				var title = "Level " + levelIndex
				return <DescriptionBlockProperties key={i} title={title} properties={this.props.features[levelIndex]} />
			}
		}, this)
		var spellcasting = null;
		if (this.props.slots['20']) {
			var slots = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]] //20
			slots = slots.map(function(level, i){
				var levelIndex = i + 1
				if (this.props.slots[levelIndex]) {
					return <div key={i} className='description-slots-content-row'>
						<div className='description-slots-content-row-title'>{levelIndex}</div>
						{this.props.slots[levelIndex].map(function(slotCount, slotLevel){
							var slotValue = slotCount;
							var slotClass = '';
							if (slotValue === '0') {
								slotValue = '•';
								slotClass = 'description-slots-content-row-empty'
							}
							return <div className={slotClass} key={slotLevel}>{slotValue}</div>
						})}
					</div>
				}
			}, this)

			var slotsTitle = [];
			var slotsMaxLevel = this.props.slots['20'].length;
			for (var i = slotsMaxLevel - 1; i >= -1; i--) {
				var slotsLevelTitleValue = i;
				if (i === 0) 
					slotsLevelTitleValue = 'CT'
				if (i === -1) 
					slotsLevelTitleValue = ' '
				var slotsLevelTitle = <div key={i} className='description-slots-content-row-title'>{slotsLevelTitleValue}</div>
				slotsTitle.unshift(slotsLevelTitle);
			}

			spellcasting = <div>
				<DescriptionBlockTitle title='Spellcasting (OPT)'/>
				<div className="description-block">
					<DescriptionItemBlack title='Spellcasting Ability:' value={this.props.spellAbility}/>
				</div>
				<div className="description-block">
					<div className='description-slots-content-row'>
						{slotsTitle}
					</div>
					{slots}
				</div>
			</div>
		}
		return (
			<div>
				<DescriptionWrapper>
					<div className="description-block">
						<DescriptionItemBlack title='Hit Dice:' value={this.props.hitDice}/>
						<DescriptionItemBlack title='Hit Points at 1st Level:' value={this.props.hpAtFirstLevel}/>
						<DescriptionItemBlack title='Hit Points at Higher Levels:' value={this.props.hpAtHigherLevels}/>
					</div>
					<div className="description-block">
						<DescriptionItemBlack title='Saving Throws:' value={this.props.proficiency}/>
					</div>
					{spellcasting}
					<div className="description-block">
						{features}
					</div>
				</DescriptionWrapper>
			</div>
		)
	}
})

var MonsterDescription = React.createClass({
	render: function() {
		return (
			<div>
				<DescriptionWrapper>
					<div className="description-subtitle">
						{this.props.sizeFull + ' ' + this.props.type + ', ' + this.props.alignment}
					</div>
					<div className='description-block'>
						<DescriptionItem title='Armor Class' value={this.props.ac}/>
						<DescriptionItem title='Hit Points' value={this.props.hp}/>
						<DescriptionItem title='Speed' value={this.props.speed}/>
					</div>
					<DescriptionBlockStats {...this.props} />
					<div className='description-block'>
						<DescriptionItem title='Saving Throws' value={this.props.save}/>
						<DescriptionItem title='Damage Vulnerables' value={this.props.vulnerable}/>
						<DescriptionItem title='Damage Resistances' value={this.props.resist}/>
						<DescriptionItem title='Damage Immunities' value={this.props.immune}/>
						<DescriptionItem title='Condition Immunities' value={this.props.conditionImmune}/>
						<DescriptionItem title='Skills' value={this.props.skill}/>
						<DescriptionItem title='Senses' value={this.props.senses}/>
						<DescriptionItem title='Languages' value={this.props.languages}/>
						<DescriptionItem title='Challenge' value={this.props.cr}/>
					</div>
					<DescriptionBlockProperties properties={this.props.trait} />
					<DescriptionBlockProperties title='Actions' properties={this.props.action} />
					<DescriptionBlockProperties title='Legengary Actions' properties={this.props.legendary} />
				</DescriptionWrapper>
			</div>
		)
	}
})

var SpellDescription = React.createClass({
	render: function() {
		iconClass = 'icon icon-school-' + this.props.school;
		return (
			<div>
				<DescriptionWrapper>
					<div className="description-subtitle">
						<div>{this.props.schoolAndLevel}</div>
					</div>
					<div className="description-block">
						<DescriptionItem title='Casting Time' value={this.props.time}/>
						<DescriptionItem title='Range' value={this.props.range}/>
						<DescriptionItem title='Components' value={this.props.components}/>
						<DescriptionItem title='Duration' value={this.props.duration}/>
					</div>
					<div className="description-block">
						<DescriptionText text={this.props.text} hiLevelIndex={this.props.hiLevelIndex} />
					</div>
				</DescriptionWrapper>
			</div>
		)
	}
})

var InlineSelect = React.createClass({
	render: function() {
		return (
			<div className='list-filters-select'>
				<div className='inline-select-wrapper'>
					<select className='inline-select' onChange={this.props.handleSelect} value={this.props.currentOption}>{this.props.options}</select>
					<div className='inline-select-holder'>
						<div>{this.props.currentOption} spells&nbsp;</div> 
						<div>▾</div>
					</div>
				</div>
			</div>
		)
	}
})

var LoadingStub = React.createClass({
	render: function() {
		return <div className='loader-wrapper'>Loading...</div>
	}
})

var NothingStub = React.createClass({
	render: function() {
		return <div className='loader-wrapper'>There is nothing here</div>
	}
})

var Wat = React.createClass({
	render: function() {
		return <div className='loader-wrapper'>WAT</div>
	}
})

var DescriptionWrapper = React.createClass({
	render: function() {
		return (
			<div className='content-wrapper-mobile'>
				<div className='description'>
					{this.props.children}
				</div>
			</div>
		)
	}
})

var DescriptionTitle = React.createClass({
	render: function() {
		return <div className='description-title'>{this.props.title}</div>;
	}
})

var DescriptionItem = React.createClass({
	render: function() {
		if (this.props.value)
			return <div className='description-item'><strong className='description-item-title'>{this.props.title} </strong>{this.props.value}</div>;
		else
			return null;
	}
})

var DescriptionItemBlack = React.createClass({
	render: function() {
		if (this.props.value)
			return <div className='description-item'><strong>{this.props.title} </strong>{this.props.value}</div>;
		else
			return null;
	}
})

var DescriptionBlockTitle = React.createClass({
	render: function() {
		return <div className='description-block-title'>{this.props.title}</div>
	}
})

var DescriptionBlockProperties = React.createClass({
	render: function() {
		var title = null;
		if (this.props.title)
			title = <DescriptionBlockTitle title={this.props.title} />
		if (this.props.properties) {
			return (
				<div className='description-block'>
					{title}
					{this.props.properties.map(function(property, i){
						return <DescriptionText key={i} text={property.text} title={property.name}/>
					}, this)}
				</div>
			)
		} else
			return null;
	}
})

var DescriptionText = React.createClass({
	render: function() {
		return (
			<div className='description-text'>
				{this.props.text.map(function(p, i){
					if (i === 0 && this.props.title)
						return <div key={i} className='description-p'><strong>{this.props.title}.</strong> {p}</div>;
					else if (this.props.hiLevelIndex && this.props.hiLevelIndex === i)
						return <div key={i} className='description-p'><strong>At Higher Levels:</strong> {p}</div>;
					else
						return <div key={i} className='description-p'>{p}</div>;
				}, this)}
			</div>
		)
	}
})

// Specific description blocks

var DescriptionBlockStats = React.createClass({
	render: function() {
		return (
			<div className='description-block'>
				<div className='description-stats-table'>
					<div className='description-stat-title'>STR</div>
					<div className='description-stat-title'>DEX</div>
					<div className='description-stat-title'>CON</div>
					<div className='description-stat-title'>INT</div>
					<div className='description-stat-title'>WIS</div>
					<div className='description-stat-title'>CHA</div>
				</div>
				<div className='description-stats-table'>
					<div>{this.props.strFull}</div>
					<div>{this.props.dexFull}</div>
					<div>{this.props.conFull}</div>
					<div>{this.props.intFull}</div>
					<div>{this.props.wisFull}</div>
					<div>{this.props.chaFull}</div>
				</div>
			</div>
		)
	}
})

var routes = (
	<Route name='app' path='/' handler={App} >
		<Route name='classes' handler={ClassesHandler} />
		<Route name='spellbook' handler={SpellbookHandler} />
		<Route name='bestiary' handler={BestiaryHandler} />
		<Route name='bookmarks' handler={Bookmarks} />
		<DefaultRoute handler={MobileMainMenu} />
	</Route>
);

Router.run(routes, function (Handler) {
	React.render(<Handler />, document.body);
});