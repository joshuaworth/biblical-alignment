/**
 * Topical Bible Index
 * 25 topics organized into 5 groups, each with 8 BSB verse references
 * All verse text is inline (Berean Standard Bible)
 */

// ---------------------------------------------------------------------------
// Public interfaces
// ---------------------------------------------------------------------------

export interface TopicalVerse {
  book: string
  slug: string
  chapter: number
  verse: number
  text: string
  reference: string
}

export interface Topic {
  id: string
  name: string
  icon: string
  description: string
  verses: TopicalVerse[]
}

export interface TopicGroup {
  id: string
  name: string
  icon: string
  topics: Topic[]
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

type VerseTuple = [string, string, number, number, string]

function toVerses(tuples: VerseTuple[]): TopicalVerse[] {
  return tuples.map(([book, slug, chapter, verse, text]) => ({
    book,
    slug,
    chapter,
    verse,
    text,
    reference: `${book} ${chapter}:${verse}`,
  }))
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const TOPICAL_GROUPS: TopicGroup[] = [
  // =========================================================================
  // GROUP 1: Core Doctrines
  // =========================================================================
  {
    id: 'core-doctrines',
    name: 'Core Doctrines',
    icon: '✝️',
    topics: [
      // 1. Salvation
      {
        id: 'salvation',
        name: 'Salvation',
        icon: '🛡️',
        description: 'God\'s plan of redemption through faith in Jesus Christ',
        verses: toVerses([
          ['John', 'john', 3, 16, 'For God so loved the world that He gave His one and only Son, that everyone who believes in Him shall not perish but have eternal life.'],
          ['Romans', 'romans', 10, 9, 'that if you confess with your mouth, "Jesus is Lord," and believe in your heart that God raised Him from the dead, you will be saved.'],
          ['Ephesians', 'ephesians', 2, 8, 'For it is by grace you have been saved through faith, and this not from yourselves; it is the gift of God,'],
          ['Acts', 'acts', 4, 12, 'Salvation exists in no one else, for there is no other name under heaven given to men by which we must be saved.'],
          ['Romans', 'romans', 6, 23, 'For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.'],
          ['Titus', 'titus', 3, 5, 'He saved us, not by the righteous deeds we had done, but according to His mercy, through the washing of new birth and renewal by the Holy Spirit,'],
          ['John', 'john', 14, 6, 'Jesus answered, "I am the way and the truth and the life. No one comes to the Father except through Me."'],
          ['2 Corinthians', '2-corinthians', 5, 17, 'Therefore if anyone is in Christ, he is a new creation. The old has passed away. Behold, the new has come!'],
        ]),
      },
      // 2. Faith
      {
        id: 'faith',
        name: 'Faith',
        icon: '🙏',
        description: 'Trusting in God and His promises with confident assurance',
        verses: toVerses([
          ['Hebrews', 'hebrews', 11, 1, 'Now faith is the assurance of what we hope for and the certainty of what we do not see.'],
          ['Hebrews', 'hebrews', 11, 6, 'And without faith it is impossible to please God, because anyone who approaches Him must believe that He exists and that He rewards those who earnestly seek Him.'],
          ['Romans', 'romans', 10, 17, 'Consequently, faith comes by hearing, and hearing by the word of Christ.'],
          ['Matthew', 'matthew', 17, 20, '"Because of your little faith," He answered. "For truly I tell you, if you have faith the size of a mustard seed, you can say to this mountain, \'Move from here to there,\' and it will move. Nothing will be impossible for you."'],
          ['Galatians', 'galatians', 2, 20, 'I have been crucified with Christ, and I no longer live, but Christ lives in me. The life I live in the body, I live by faith in the Son of God, who loved me and gave Himself up for me.'],
          ['Romans', 'romans', 5, 1, 'Therefore, since we have been justified through faith, we have peace with God through our Lord Jesus Christ,'],
          ['James', 'james', 2, 17, 'So also faith, if it does not have works, is dead in itself.'],
          ['Mark', 'mark', 11, 22, 'Jesus answered, "Have faith in God."'],
        ]),
      },
      // 3. Grace
      {
        id: 'grace',
        name: 'Grace',
        icon: '✨',
        description: 'God\'s unmerited favor and boundless love for His people',
        verses: toVerses([
          ['2 Corinthians', '2-corinthians', 12, 9, 'But He said to me, "My grace is sufficient for you, for My power is perfected in weakness."'],
          ['Ephesians', 'ephesians', 2, 8, 'For it is by grace you have been saved through faith, and this not from yourselves; it is the gift of God,'],
          ['Romans', 'romans', 5, 8, 'But God proves His love for us in this: While we were still sinners, Christ died for us.'],
          ['2 Corinthians', '2-corinthians', 9, 8, 'And God is able to make all grace abound to you, so that in all things, at all times, having all that you need, you will abound in every good work.'],
          ['John', 'john', 1, 16, 'From His fullness we have all received grace upon grace.'],
          ['Romans', 'romans', 3, 24, 'and are justified freely by His grace through the redemption that is in Christ Jesus.'],
          ['Ephesians', 'ephesians', 1, 7, 'In Him we have redemption through His blood, the forgiveness of our trespasses, according to the riches of His grace'],
          ['Hebrews', 'hebrews', 4, 16, 'Let us then approach the throne of grace with confidence, so that we may receive mercy and find grace to help us in our time of need.'],
        ]),
      },
      // 4. Forgiveness
      {
        id: 'forgiveness',
        name: 'Forgiveness',
        icon: '💧',
        description: 'The cleansing power of God\'s forgiveness and our call to forgive',
        verses: toVerses([
          ['1 John', '1-john', 1, 9, 'If we confess our sins, He is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.'],
          ['Ephesians', 'ephesians', 4, 32, 'Be kind and tenderhearted to one another, forgiving each other just as in Christ God forgave you.'],
          ['Psalms', 'psalms', 103, 12, 'As far as the east is from the west, so far has He removed our transgressions from us.'],
          ['Colossians', 'colossians', 3, 13, 'Bear with one another and forgive any complaint you may have against someone else. Forgive as the Lord forgave you.'],
          ['Isaiah', 'isaiah', 43, 25, 'I, yes I, am He who blots out your transgressions for My own sake and remembers your sins no more.'],
          ['Matthew', 'matthew', 6, 14, 'For if you forgive men their trespasses, your heavenly Father will also forgive you.'],
          ['Acts', 'acts', 3, 19, 'Repent, then, and turn back, so that your sins may be wiped away,'],
          ['Psalms', 'psalms', 86, 5, 'For You, O Lord, are good and forgiving, rich in loving devotion to all who call on You.'],
        ]),
      },
      // 5. God's Promises
      {
        id: 'gods-promises',
        name: 'God\'s Promises',
        icon: '🌈',
        description: 'The faithful and unchanging promises of our covenant-keeping God',
        verses: toVerses([
          ['Jeremiah', 'jeremiah', 29, 11, 'For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, to give you a future and a hope.'],
          ['Romans', 'romans', 8, 28, 'And we know that God works all things together for the good of those who love Him, who are called according to His purpose.'],
          ['Philippians', 'philippians', 4, 19, 'And my God will supply all your needs according to His glorious riches in Christ Jesus.'],
          ['2 Peter', '2-peter', 1, 4, 'Through these He has given us His precious and magnificent promises, so that through them you may become partakers of the divine nature, now that you have escaped the corruption in the world caused by evil desires.'],
          ['Isaiah', 'isaiah', 40, 31, 'But those who wait upon the LORD will renew their strength; they will mount up with wings like eagles; they will run and not grow weary; they will walk and not faint.'],
          ['Deuteronomy', 'deuteronomy', 31, 6, 'Be strong and courageous; do not be afraid or terrified of them, for the LORD your God goes with you; He will never leave you nor forsake you.'],
          ['Lamentations', 'lamentations', 3, 22, 'Because of the loving devotion of the LORD we are not consumed, for His compassions never fail.'],
          ['Numbers', 'numbers', 23, 19, 'God is not a man, that He should lie, or a son of man, that He should change His mind. Does He speak and not act? Does He promise and not fulfill?'],
        ]),
      },
    ],
  },

  // =========================================================================
  // GROUP 2: Life Struggles
  // =========================================================================
  {
    id: 'life-struggles',
    name: 'Life Struggles',
    icon: '🤲',
    topics: [
      // 6. Anxiety & Worry
      {
        id: 'anxiety-worry',
        name: 'Anxiety & Worry',
        icon: '🕊️',
        description: 'Finding peace and rest in God when overwhelmed by worry',
        verses: toVerses([
          ['Philippians', 'philippians', 4, 6, 'Be anxious for nothing, but in everything, by prayer and petition, with thanksgiving, present your requests to God.'],
          ['1 Peter', '1-peter', 5, 7, 'Cast all your anxiety on Him, because He cares for you.'],
          ['Matthew', 'matthew', 6, 34, 'Therefore do not worry about tomorrow, for tomorrow will worry about itself. Today has enough trouble of its own.'],
          ['Psalms', 'psalms', 55, 22, 'Cast your burden upon the LORD and He will sustain you; He will never let the righteous be shaken.'],
          ['Isaiah', 'isaiah', 41, 10, 'Do not fear, for I am with you; do not be afraid, for I am your God. I will strengthen you; I will surely help you; I will uphold you with My righteous right hand.'],
          ['John', 'john', 14, 27, 'Peace I leave with you; My peace I give to you. I do not give to you as the world gives. Do not let your hearts be troubled; do not be afraid.'],
          ['Proverbs', 'proverbs', 12, 25, 'Anxiety in a man\'s heart weighs it down, but a good word cheers it up.'],
          ['Matthew', 'matthew', 11, 28, 'Come to Me, all you who are weary and burdened, and I will give you rest.'],
        ]),
      },
      // 7. Fear
      {
        id: 'fear',
        name: 'Fear',
        icon: '🔦',
        description: 'Overcoming fear through trust in the Lord\'s presence and power',
        verses: toVerses([
          ['2 Timothy', '2-timothy', 1, 7, 'For God has not given us a spirit of fear, but of power, love, and self-control.'],
          ['Psalms', 'psalms', 56, 3, 'When I am afraid, I will trust in You.'],
          ['Isaiah', 'isaiah', 41, 13, 'For I am the LORD your God who takes hold of your right hand and tells you, "Do not fear, I will help you."'],
          ['Joshua', 'joshua', 1, 9, 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God is with you wherever you go.'],
          ['Psalms', 'psalms', 27, 1, 'The LORD is my light and my salvation\u2014 whom shall I fear? The LORD is the stronghold of my life\u2014 of whom shall I be afraid?'],
          ['Romans', 'romans', 8, 31, 'What then shall we say in response to these things? If God is for us, who can be against us?'],
          ['Psalms', 'psalms', 34, 4, 'I sought the LORD, and He answered me; He delivered me from all my fears.'],
          ['Isaiah', 'isaiah', 43, 2, 'When you pass through the waters, I will be with you; and when you walk through the fire, you will not be scorched; the flames will not set you ablaze.'],
        ]),
      },
      // 8. Grief & Loss
      {
        id: 'grief-loss',
        name: 'Grief & Loss',
        icon: '💔',
        description: 'Comfort and hope from God in times of mourning and loss',
        verses: toVerses([
          ['Psalms', 'psalms', 34, 18, 'The LORD is near to the brokenhearted and saves the crushed in spirit.'],
          ['Revelation', 'revelation', 21, 4, 'He will wipe away every tear from their eyes, and there will be no more death or mourning or crying or pain, for the former things have passed away.'],
          ['Psalms', 'psalms', 147, 3, 'He heals the brokenhearted and binds up their wounds.'],
          ['Matthew', 'matthew', 5, 4, 'Blessed are those who mourn, for they will be comforted.'],
          ['John', 'john', 11, 25, 'Jesus said to her, "I am the resurrection and the life. The one who believes in Me will live, even though he dies."'],
          ['Psalms', 'psalms', 30, 5, 'For His anger is but for a moment, but His favor lasts a lifetime. Weeping may stay the night, but joy comes in the morning.'],
          ['2 Corinthians', '2-corinthians', 1, 3, 'Blessed be the God and Father of our Lord Jesus Christ, the Father of compassion and the God of all comfort,'],
          ['Romans', 'romans', 8, 18, 'For I consider that our present sufferings are not worth comparing with the glory that will be revealed in us.'],
        ]),
      },
      // 9. Loneliness
      {
        id: 'loneliness',
        name: 'Loneliness',
        icon: '🤝',
        description: 'God\'s unfailing presence and companionship in times of isolation',
        verses: toVerses([
          ['Deuteronomy', 'deuteronomy', 31, 8, 'The LORD Himself goes before you; He will be with you. He will never leave you nor forsake you. Do not be afraid or discouraged.'],
          ['Psalms', 'psalms', 23, 4, 'Even though I walk through the valley of the shadow of death, I will fear no evil, for You are with me; Your rod and Your staff, they comfort me.'],
          ['Matthew', 'matthew', 28, 20, 'And surely I am with you always, even to the end of the age.'],
          ['Psalms', 'psalms', 139, 7, 'Where can I go from Your Spirit? Where can I flee from Your presence?'],
          ['Hebrews', 'hebrews', 13, 5, 'Keep your lives free from the love of money and be content with what you have, for God Himself has said, "Never will I leave you, never will I forsake you."'],
          ['Psalms', 'psalms', 68, 6, 'God settles the solitary in families; He leads the prisoners out to prosperity. But the rebellious dwell in a sun-scorched land.'],
          ['Isaiah', 'isaiah', 49, 16, 'Behold, I have engraved you on the palms of My hands; your walls are ever before Me.'],
          ['Romans', 'romans', 8, 38, 'For I am convinced that neither death nor life, neither angels nor principalities, neither the present nor the future, nor any powers,'],
        ]),
      },
      // 10. Anger
      {
        id: 'anger',
        name: 'Anger',
        icon: '🔥',
        description: 'Biblical wisdom for managing anger and responding with grace',
        verses: toVerses([
          ['Proverbs', 'proverbs', 15, 1, 'A gentle answer turns away wrath, but a harsh word stirs up anger.'],
          ['James', 'james', 1, 19, 'My beloved brothers, understand this: Everyone should be quick to listen, slow to speak, and slow to anger,'],
          ['Ephesians', 'ephesians', 4, 26, '"Be angry, yet do not sin." Do not let the sun set upon your anger,'],
          ['Proverbs', 'proverbs', 29, 11, 'A fool vents all his anger, but a wise man holds it back.'],
          ['Psalms', 'psalms', 37, 8, 'Refrain from anger and abandon wrath; do not fret\u2014 it can only bring harm.'],
          ['Colossians', 'colossians', 3, 8, 'But now you must put aside all such things as these: anger, rage, malice, slander, and filthy language from your lips.'],
          ['Proverbs', 'proverbs', 16, 32, 'A patient man is better than a warrior, and one who controls his temper is better than one who captures a city.'],
          ['Romans', 'romans', 12, 19, 'Do not avenge yourselves, beloved, but leave room for God\'s wrath. For it is written: "Vengeance is Mine; I will repay, says the Lord."'],
        ]),
      },
    ],
  },

  // =========================================================================
  // GROUP 3: Spiritual Growth
  // =========================================================================
  {
    id: 'spiritual-growth',
    name: 'Spiritual Growth',
    icon: '🌱',
    topics: [
      // 11. Prayer
      {
        id: 'prayer',
        name: 'Prayer',
        icon: '🙏',
        description: 'Drawing near to God through prayer and supplication',
        verses: toVerses([
          ['Philippians', 'philippians', 4, 6, 'Be anxious for nothing, but in everything, by prayer and petition, with thanksgiving, present your requests to God.'],
          ['Matthew', 'matthew', 6, 6, 'But when you pray, go into your inner room, shut your door, and pray to your Father, who is unseen. And your Father, who sees what is done in secret, will reward you.'],
          ['1 Thessalonians', '1-thessalonians', 5, 17, 'Pray without ceasing.'],
          ['James', 'james', 5, 16, 'Therefore confess your sins to each other and pray for each other so that you may be healed. The prayer of a righteous man has great power to prevail.'],
          ['Matthew', 'matthew', 7, 7, 'Ask, and it will be given to you; seek, and you will find; knock, and the door will be opened to you.'],
          ['1 John', '1-john', 5, 14, 'And this is the confidence that we have before Him: If we ask anything according to His will, He hears us.'],
          ['Romans', 'romans', 8, 26, 'In the same way, the Spirit helps us in our weakness. For we do not know how we ought to pray, but the Spirit Himself intercedes for us with groans too deep for words.'],
          ['Jeremiah', 'jeremiah', 33, 3, 'Call to Me, and I will answer you, and I will tell you great and unsearchable things you do not know.'],
        ]),
      },
      // 12. Wisdom
      {
        id: 'wisdom',
        name: 'Wisdom',
        icon: '📖',
        description: 'Seeking and applying godly wisdom in every area of life',
        verses: toVerses([
          ['James', 'james', 1, 5, 'Now if any of you lacks wisdom, he should ask God, who gives generously to all without finding fault, and it will be given to him.'],
          ['Proverbs', 'proverbs', 9, 10, 'The fear of the LORD is the beginning of wisdom, and knowledge of the Holy One is understanding.'],
          ['Proverbs', 'proverbs', 3, 5, 'Trust in the LORD with all your heart, and lean not on your own understanding.'],
          ['Colossians', 'colossians', 3, 16, 'Let the word of Christ richly dwell within you as you teach and admonish one another with all wisdom, singing psalms, hymns, and spiritual songs, with gratitude in your hearts to God.'],
          ['Proverbs', 'proverbs', 2, 6, 'For the LORD gives wisdom; from His mouth come knowledge and understanding.'],
          ['Proverbs', 'proverbs', 4, 7, 'Wisdom is supreme; therefore acquire wisdom. And whatever you acquire, gain understanding.'],
          ['James', 'james', 3, 17, 'But the wisdom from above is first of all pure, then peaceable, gentle, accommodating, full of mercy and good fruit, impartial, and sincere.'],
          ['Psalms', 'psalms', 111, 10, 'The fear of the LORD is the beginning of wisdom. All who follow His precepts gain rich understanding. His praise endures forever.'],
        ]),
      },
      // 13. Patience
      {
        id: 'patience',
        name: 'Patience',
        icon: '⏳',
        description: 'Enduring with faith and perseverance through trials and waiting',
        verses: toVerses([
          ['James', 'james', 1, 2, 'Consider it pure joy, my brothers, when you encounter trials of many kinds,'],
          ['Romans', 'romans', 12, 12, 'Be joyful in hope, patient in affliction, persistent in prayer.'],
          ['Galatians', 'galatians', 6, 9, 'Let us not grow weary in doing good, for in due time we will reap a harvest if we do not give up.'],
          ['Psalms', 'psalms', 37, 7, 'Be still before the LORD and wait patiently for Him; do not fret when men prosper in their ways, when they carry out wicked schemes.'],
          ['Hebrews', 'hebrews', 10, 36, 'For you need perseverance, so that after you have done the will of God, you will receive what He has promised.'],
          ['Ecclesiastes', 'ecclesiastes', 7, 8, 'The end of a matter is better than its beginning, and a patient spirit is better than a proud one.'],
          ['Isaiah', 'isaiah', 40, 31, 'But those who wait upon the LORD will renew their strength; they will mount up with wings like eagles; they will run and not grow weary; they will walk and not faint.'],
          ['Lamentations', 'lamentations', 3, 25, 'The LORD is good to those who wait for Him, to the soul that seeks Him.'],
        ]),
      },
      // 14. Love
      {
        id: 'love',
        name: 'Love',
        icon: '❤️',
        description: 'The greatest commandment and the defining mark of Christ\'s followers',
        verses: toVerses([
          ['1 Corinthians', '1-corinthians', 13, 4, 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.'],
          ['John', 'john', 13, 34, 'A new commandment I give you: Love one another. As I have loved you, so you also must love one another.'],
          ['1 John', '1-john', 4, 19, 'We love because He first loved us.'],
          ['Romans', 'romans', 13, 10, 'Love does no wrong to its neighbor. Therefore love is the fulfillment of the law.'],
          ['1 Corinthians', '1-corinthians', 13, 13, 'And now these three remain: faith, hope, and love; but the greatest of these is love.'],
          ['1 John', '1-john', 4, 7, 'Beloved, let us love one another, for love comes from God. Everyone who loves has been born of God and knows God.'],
          ['John', 'john', 15, 13, 'Greater love has no one than this, that he lay down his life for his friends.'],
          ['Matthew', 'matthew', 22, 37, 'Jesus declared, "Love the Lord your God with all your heart and with all your soul and with all your mind."'],
        ]),
      },
      // 15. Hope
      {
        id: 'hope',
        name: 'Hope',
        icon: '🌅',
        description: 'Anchoring our souls in the living hope found in Christ',
        verses: toVerses([
          ['Romans', 'romans', 15, 13, 'May the God of hope fill you with all joy and peace as you believe in Him, so that you may overflow with hope by the power of the Holy Spirit.'],
          ['Jeremiah', 'jeremiah', 29, 11, 'For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, to give you a future and a hope.'],
          ['Hebrews', 'hebrews', 10, 23, 'Let us hold resolutely to the hope we profess, for He who promised is faithful.'],
          ['Romans', 'romans', 8, 24, 'For in this hope we were saved. But hope that is seen is not hope at all. Who hopes for what he can already see?'],
          ['Psalms', 'psalms', 71, 5, 'For You are my hope, O Lord GOD, my confidence from my youth.'],
          ['1 Peter', '1-peter', 1, 3, 'Blessed be the God and Father of our Lord Jesus Christ! By His great mercy He has given us new birth into a living hope through the resurrection of Jesus Christ from the dead,'],
          ['Psalms', 'psalms', 130, 5, 'I wait for the LORD; my soul waits, and in His word I put my hope.'],
          ['Romans', 'romans', 5, 3, 'Not only that, but we also rejoice in our sufferings, because we know that suffering produces perseverance;'],
        ]),
      },
    ],
  },

  // =========================================================================
  // GROUP 4: Relationships
  // =========================================================================
  {
    id: 'relationships',
    name: 'Relationships',
    icon: '👥',
    topics: [
      // 16. Marriage
      {
        id: 'marriage',
        name: 'Marriage',
        icon: '💍',
        description: 'God\'s design for the sacred covenant of marriage',
        verses: toVerses([
          ['Genesis', 'genesis', 2, 24, 'For this reason a man will leave his father and mother and be united to his wife, and they will become one flesh.'],
          ['Ephesians', 'ephesians', 5, 25, 'Husbands, love your wives, just as Christ loved the church and gave Himself up for her'],
          ['1 Corinthians', '1-corinthians', 13, 4, 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.'],
          ['Proverbs', 'proverbs', 31, 10, 'A wife of noble character, who can find? She is far more precious than rubies.'],
          ['Ecclesiastes', 'ecclesiastes', 4, 9, 'Two are better than one, because they have a good return for their labor.'],
          ['Colossians', 'colossians', 3, 19, 'Husbands, love your wives and do not be harsh with them.'],
          ['Mark', 'mark', 10, 9, 'Therefore what God has joined together, let man not separate.'],
          ['1 Peter', '1-peter', 4, 8, 'Above all, love one another deeply, because love covers over a multitude of sins.'],
        ]),
      },
      // 17. Parenting
      {
        id: 'parenting',
        name: 'Parenting',
        icon: '👶',
        description: 'Raising children in the discipline and instruction of the Lord',
        verses: toVerses([
          ['Proverbs', 'proverbs', 22, 6, 'Train up a child in the way he should go, and when he is old he will not depart from it.'],
          ['Ephesians', 'ephesians', 6, 4, 'Fathers, do not provoke your children to anger; instead, bring them up in the discipline and instruction of the Lord.'],
          ['Deuteronomy', 'deuteronomy', 6, 7, 'And you shall teach them diligently to your children and speak of them when you sit at home and when you walk along the road, when you lie down and when you get up.'],
          ['Psalms', 'psalms', 127, 3, 'Children are a heritage from the LORD, and the fruit of the womb is His reward.'],
          ['Proverbs', 'proverbs', 29, 17, 'Discipline your son, and he will give you rest; he will bring delight to your soul.'],
          ['3 John', '3-john', 1, 4, 'I have no greater joy than to hear that my children are walking in the truth.'],
          ['Proverbs', 'proverbs', 1, 8, 'Listen, my son, to your father\'s instruction, and do not forsake your mother\'s teaching.'],
          ['Isaiah', 'isaiah', 54, 13, 'Then all your children will be taught by the LORD, and great will be their peace.'],
        ]),
      },
      // 18. Friendship
      {
        id: 'friendship',
        name: 'Friendship',
        icon: '🤝',
        description: 'The blessing and responsibility of godly friendships',
        verses: toVerses([
          ['Proverbs', 'proverbs', 17, 17, 'A friend loves at all times, and a brother is born for adversity.'],
          ['Proverbs', 'proverbs', 27, 17, 'As iron sharpens iron, so one man sharpens another.'],
          ['Proverbs', 'proverbs', 18, 24, 'A man of many companions may come to ruin, but there is a friend who sticks closer than a brother.'],
          ['Ecclesiastes', 'ecclesiastes', 4, 9, 'Two are better than one, because they have a good return for their labor.'],
          ['John', 'john', 15, 13, 'Greater love has no one than this, that he lay down his life for his friends.'],
          ['Proverbs', 'proverbs', 13, 20, 'Walk with the wise and become wise, but a companion of fools will be destroyed.'],
          ['Romans', 'romans', 12, 10, 'Be devoted to one another in brotherly love. Outdo one another in showing honor.'],
          ['1 Thessalonians', '1-thessalonians', 5, 11, 'Therefore encourage one another and build each other up, just as you are already doing.'],
        ]),
      },
      // 19. Integrity
      {
        id: 'integrity',
        name: 'Integrity',
        icon: '⚖️',
        description: 'Walking uprightly with honesty and moral consistency',
        verses: toVerses([
          ['Proverbs', 'proverbs', 10, 9, 'He who walks in integrity walks securely, but he who perverts his ways will be found out.'],
          ['Proverbs', 'proverbs', 11, 3, 'The integrity of the upright guides them, but the crookedness of the unfaithful destroys them.'],
          ['Psalms', 'psalms', 15, 1, 'O LORD, who may dwell in Your tent? Who may live on Your holy mountain?'],
          ['Luke', 'luke', 16, 10, 'Whoever is faithful with very little will also be faithful with much, and whoever is dishonest with very little will also be dishonest with much.'],
          ['Micah', 'micah', 6, 8, 'He has shown you, O man, what is good. And what does the LORD require of you but to act justly, to love mercy, and to walk humbly with your God?'],
          ['Proverbs', 'proverbs', 20, 7, 'The righteous man walks in his integrity; blessed are his children after him.'],
          ['Colossians', 'colossians', 3, 23, 'Whatever you do, work at it with your whole being, for the Lord and not for men,'],
          ['Titus', 'titus', 2, 7, 'In everything, show yourself to be an example by doing good works. In your teaching show integrity, dignity,'],
        ]),
      },
      // 20. Humility
      {
        id: 'humility',
        name: 'Humility',
        icon: '🪶',
        description: 'The posture of a servant heart before God and others',
        verses: toVerses([
          ['Philippians', 'philippians', 2, 3, 'Do nothing out of selfish ambition or empty pride, but in humility consider others more important than yourselves.'],
          ['James', 'james', 4, 10, 'Humble yourselves before the Lord, and He will lift you up.'],
          ['Proverbs', 'proverbs', 11, 2, 'When pride comes, disgrace follows, but with humility comes wisdom.'],
          ['1 Peter', '1-peter', 5, 6, 'Humble yourselves, therefore, under God\'s mighty hand, so that in due time He may exalt you.'],
          ['Matthew', 'matthew', 23, 12, 'For whoever exalts himself will be humbled, and whoever humbles himself will be exalted.'],
          ['Proverbs', 'proverbs', 15, 33, 'The fear of the LORD is the instruction of wisdom, and humility comes before honor.'],
          ['Micah', 'micah', 6, 8, 'He has shown you, O man, what is good. And what does the LORD require of you but to act justly, to love mercy, and to walk humbly with your God?'],
          ['Colossians', 'colossians', 3, 12, 'Therefore, as the elect of God, holy and beloved, clothe yourselves with hearts of compassion, kindness, humility, gentleness, and patience.'],
        ]),
      },
    ],
  },

  // =========================================================================
  // GROUP 5: Character
  // =========================================================================
  {
    id: 'character',
    name: 'Character',
    icon: '💎',
    topics: [
      // 21. Courage
      {
        id: 'courage',
        name: 'Courage',
        icon: '🦁',
        description: 'Standing firm in faith with boldness and confidence in God',
        verses: toVerses([
          ['Joshua', 'joshua', 1, 9, 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God is with you wherever you go.'],
          ['Deuteronomy', 'deuteronomy', 31, 6, 'Be strong and courageous; do not be afraid or terrified of them, for the LORD your God goes with you; He will never leave you nor forsake you.'],
          ['Isaiah', 'isaiah', 41, 10, 'Do not fear, for I am with you; do not be afraid, for I am your God. I will strengthen you; I will surely help you; I will uphold you with My righteous right hand.'],
          ['Psalms', 'psalms', 31, 24, 'Be strong and courageous, all you who put your hope in the LORD.'],
          ['1 Corinthians', '1-corinthians', 16, 13, 'Be on the alert. Stand firm in the faith. Be men of courage. Be strong.'],
          ['John', 'john', 16, 33, 'I have told you these things so that in Me you may have peace. In the world you will have tribulation. But take courage; I have overcome the world!'],
          ['Romans', 'romans', 8, 37, 'No, in all these things we are more than conquerors through Him who loved us.'],
          ['2 Chronicles', '2-chronicles', 20, 15, 'And he said, "Listen, all you people of Judah and Jerusalem! Listen, King Jehoshaphat! This is what the LORD says: Do not be afraid or discouraged because of this vast army, for the battle is not yours, but God\'s."'],
        ]),
      },
      // 22. Generosity
      {
        id: 'generosity',
        name: 'Generosity',
        icon: '🎁',
        description: 'Giving freely and cheerfully as God has given to us',
        verses: toVerses([
          ['2 Corinthians', '2-corinthians', 9, 7, 'Each one should give what he has decided in his heart to give, not out of regret or compulsion. For God loves a cheerful giver.'],
          ['Proverbs', 'proverbs', 19, 17, 'Kindness to the poor is a loan to the LORD, and He will repay the lender.'],
          ['Luke', 'luke', 6, 38, 'Give, and it will be given to you. A good measure, pressed down, shaken together, and running over will be poured into your lap. For with the measure you use, it will be measured back to you.'],
          ['Acts', 'acts', 20, 35, 'In everything I showed you that by working hard in this way, you must help the weak, remembering the words of the Lord Jesus, that He Himself said, \'It is more blessed to give than to receive.\''],
          ['Proverbs', 'proverbs', 3, 9, 'Honor the LORD with your wealth, with the firstfruits of all your produce.'],
          ['Matthew', 'matthew', 6, 3, 'But when you give to the needy, do not let your left hand know what your right hand is doing,'],
          ['1 Timothy', '1-timothy', 6, 18, 'Instruct them to do good, to be rich in good works, and to be generous and ready to share,'],
          ['Hebrews', 'hebrews', 13, 16, 'And do not neglect to do good and to share with others, for with such sacrifices God is pleased.'],
        ]),
      },
      // 23. Healing
      {
        id: 'healing',
        name: 'Healing',
        icon: '🩹',
        description: 'God\'s power to heal the body, mind, and spirit',
        verses: toVerses([
          ['Psalms', 'psalms', 147, 3, 'He heals the brokenhearted and binds up their wounds.'],
          ['Isaiah', 'isaiah', 53, 5, 'But He was pierced for our transgressions, He was crushed for our iniquities; the punishment that brought us peace was upon Him, and by His stripes we are healed.'],
          ['Jeremiah', 'jeremiah', 17, 14, 'Heal me, O LORD, and I will be healed; save me, and I will be saved, for You are my praise.'],
          ['James', 'james', 5, 16, 'Therefore confess your sins to each other and pray for each other so that you may be healed. The prayer of a righteous man has great power to prevail.'],
          ['Psalms', 'psalms', 103, 3, 'who forgives all your iniquities and heals all your diseases,'],
          ['3 John', '3-john', 1, 2, 'Beloved, I pray that in every way you may prosper and enjoy good health, as your soul also prospers.'],
          ['Exodus', 'exodus', 15, 26, 'He said, "If you will diligently listen to the voice of the LORD your God, and do what is right in His eyes, and pay attention to His commands, and keep all His statutes, then I will not bring on you any of the diseases I inflicted on the Egyptians. For I am the LORD who heals you."'],
          ['Psalms', 'psalms', 30, 2, 'O LORD my God, I cried out to You, and You healed me.'],
        ]),
      },
      // 24. Strength
      {
        id: 'strength',
        name: 'Strength',
        icon: '💪',
        description: 'Drawing strength from the Lord when our own runs out',
        verses: toVerses([
          ['Philippians', 'philippians', 4, 13, 'I can do all things through Christ who gives me strength.'],
          ['Isaiah', 'isaiah', 40, 29, 'He gives power to the faint and increases the strength of the weak.'],
          ['Psalms', 'psalms', 46, 1, 'God is our refuge and strength, an ever-present help in times of trouble.'],
          ['Ephesians', 'ephesians', 6, 10, 'Finally, be strong in the Lord and in His mighty power.'],
          ['2 Corinthians', '2-corinthians', 12, 9, 'But He said to me, "My grace is sufficient for you, for My power is perfected in weakness."'],
          ['Psalms', 'psalms', 73, 26, 'My flesh and my heart may fail, but God is the strength of my heart and my portion forever.'],
          ['Nehemiah', 'nehemiah', 8, 10, 'Then Nehemiah told them, "Go and eat what is rich, drink what is sweet, and send portions to those who have nothing prepared, since today is holy to our Lord. Do not grieve, for the joy of the LORD is your strength."'],
          ['Isaiah', 'isaiah', 40, 31, 'But those who wait upon the LORD will renew their strength; they will mount up with wings like eagles; they will run and not grow weary; they will walk and not faint.'],
        ]),
      },
      // 25. Peace
      {
        id: 'peace',
        name: 'Peace',
        icon: '☮️',
        description: 'The supernatural peace of God that guards hearts and minds',
        verses: toVerses([
          ['Philippians', 'philippians', 4, 7, 'And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.'],
          ['John', 'john', 14, 27, 'Peace I leave with you; My peace I give to you. I do not give to you as the world gives. Do not let your hearts be troubled; do not be afraid.'],
          ['Isaiah', 'isaiah', 26, 3, 'You will keep in perfect peace those whose minds are steadfast, because they trust in You.'],
          ['Colossians', 'colossians', 3, 15, 'Let the peace of Christ rule in your hearts, for to this you were called as members of one body. And be thankful.'],
          ['Romans', 'romans', 5, 1, 'Therefore, since we have been justified through faith, we have peace with God through our Lord Jesus Christ,'],
          ['Psalms', 'psalms', 119, 165, 'Great peace have those who love Your law, and nothing can make them stumble.'],
          ['Numbers', 'numbers', 6, 24, 'The LORD bless you and keep you;'],
          ['Matthew', 'matthew', 5, 9, 'Blessed are the peacemakers, for they will be called sons of God.'],
        ]),
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

/**
 * Get a single topic by its id across all groups.
 */
export function getTopicById(id: string): Topic | undefined {
  for (const group of TOPICAL_GROUPS) {
    const topic = group.topics.find((t) => t.id === id)
    if (topic) return topic
  }
  return undefined
}

/**
 * Get a topic group by its id.
 */
export function getGroupById(id: string): TopicGroup | undefined {
  return TOPICAL_GROUPS.find((g) => g.id === id)
}

/**
 * Get a flat array of all 25 topics.
 */
export function getAllTopics(): Topic[] {
  return TOPICAL_GROUPS.flatMap((g) => g.topics)
}
