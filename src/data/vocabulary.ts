import type { VocabDay } from '@/types/vocabulary'
import type { BlankExercise, ExerciseSet, Flashcard, QuizQuestion } from '@/types/exercise'
import { parseBlanks } from '@/data/exercises'
import { shuffle } from '@/utils/text'

/**
 * Vocabulary per day (shape: `VocabDay` in src/types/vocabulary.ts). Add an object with the
 * `date` the words belong to and they appear on that day in the daily review.
 * - `focus`: the part of the word to call out (stress, prefix, suffix), e.g. 'UN' in 'unauthorised'
 * - `family`: forms leading to the word, e.g. little (adj) → less (adj) → lessen (v)
 * - `blanks`: gap-filling sentences, answers in square brackets
 */
export const vocabulary: VocabDay[] = [
  {
    date: '2026-10-07',
    title: 'School attendance',
    words: [
      {
        word: 'attendance',
        pos: 'n',
        meaning: 'sự tham gia / tham dự',
        family: [{ word: 'attend', pos: 'v', meaning: 'tham gia / tham dự' }],
      },
      {
        word: 'essential',
        focus: 'ial',
        ipa: 'ɪˈsenʃl',
        pos: 'adj',
        meaning: 'chính yếu / thiết yếu',
      },
      {
        word: 'register sb',
        ipa: 'ˈredʒɪstər',
        pos: 'v',
        meaning: 'đăng kí / ghi danh cho ai đó',
        note: 'Trong câu là passive voice (be registered).',
      },
      {
        word: 'on time',
        pos: 'idiom',
        meaning: 'đúng giờ',
        example: 'The train arrived right on time.',
      },
      {
        word: 'lessen',
        focus: 'en',
        ipa: 'ˈlesn',
        pos: 'v',
        meaning: 'làm cho ít đi / làm giảm đi',
        family: [
          { word: 'little', pos: 'adj', meaning: 'ít' },
          { word: 'less', pos: 'adj', meaning: 'ít hơn (so sánh hơn của little)' },
        ],
      },
      {
        word: 'unauthorised',
        focus: 'un',
        pos: 'adj',
        meaning: 'chưa được xác nhận',
        family: [
          { word: 'authorise sth', pos: 'v', meaning: 'xác nhận / phê duyệt' },
          { word: 'authorised', pos: 'adj', meaning: 'được xác nhận' },
        ],
        note: 'Unauthorised absence: đi học mà nghỉ không phép.',
      },
      {
        word: 'session',
        focus: 'ion',
        ipa: 'ˈseʃn',
        pos: 'n',
        meaning: 'một buổi / một phiên',
        example: 'The club held football coaching sessions for children in the area.',
      },
      {
        word: 'vital',
        ipa: 'ˈvaɪtl',
        pos: 'adj',
        meaning: 'cực kì quan trọng',
        example: 'the vitamins that are vital for health',
      },
      {
        word: 'unsatisfactory',
        focus: 'un',
        ipa: 'ˌʌnˌsætɪsˈfæktəri',
        pos: 'adj',
        meaning: 'chưa hài lòng',
        family: [
          { word: 'satisfy', pos: 'v', meaning: 'làm hài lòng / thoả mãn' },
          { word: 'satisfactory', pos: 'adj', meaning: 'hài lòng / thoả mãn' },
        ],
      },
      {
        word: 'religious',
        focus: 'ious',
        ipa: 'rɪˈlɪdʒəs',
        pos: 'adj',
        meaning: 'thuộc về tôn giáo',
        family: [{ word: 'religion', pos: 'n', meaning: 'tôn giáo' }],
      },
      {
        word: 'punctually',
        focus: 'ly',
        ipa: 'ˈpʌŋktʃuəli',
        pos: 'adv',
        meaning: 'một cách đúng giờ',
        family: [{ word: 'punctual', pos: 'adj', meaning: 'đúng giờ' }],
        example: 'Pupils are expected to arrive punctually every morning.',
      },
      {
        word: 'timekeeping',
        ipa: 'ˈtaɪmkiːpɪŋ',
        pos: 'n',
        meaning: 'việc giữ giờ giấc / sự đúng giờ',
        example: 'Good timekeeping is part of good attendance.',
      },
      {
        word: 'disruption',
        focus: 'ion',
        ipa: 'dɪsˈrʌpʃn',
        pos: 'n',
        meaning: 'sự gián đoạn / sự xáo trộn',
        family: [{ word: 'disrupt sth', pos: 'v', meaning: 'làm gián đoạn / làm xáo trộn' }],
        example: 'Arriving late causes disruption to the lesson.',
      },
      {
        word: 'truancy',
        focus: 'cy',
        ipa: 'ˈtruːənsi',
        pos: 'n',
        meaning: 'sự trốn học',
        family: [{ word: 'truant', pos: 'n', meaning: 'học sinh trốn học' }],
        note: 'Play truant: trốn học.',
      },
      {
        word: 'unavoidable',
        focus: 'un',
        ipa: 'ˌʌnəˈvɔɪdəbl',
        pos: 'adj',
        meaning: 'không thể tránh được',
        family: [
          { word: 'avoid sth', pos: 'v', meaning: 'tránh' },
          { word: 'avoidable', pos: 'adj', meaning: 'có thể tránh được' },
        ],
      },
      {
        word: 'bereavement',
        focus: 'ment',
        ipa: 'bɪˈriːvmənt',
        pos: 'n',
        meaning: 'sự mất người thân (có tang)',
        family: [{ word: 'bereaved', pos: 'adj', meaning: 'có người thân vừa qua đời' }],
      },
      {
        word: 'observance',
        focus: 'ance',
        ipa: 'əbˈzɜːvəns',
        pos: 'n',
        meaning: 'sự tuân thủ (luật lệ); việc cử hành (lễ tôn giáo)',
        family: [{ word: 'observe sth', pos: 'v', meaning: 'tuân thủ / cử hành' }],
        note: 'Religious observance: ngày lễ tôn giáo (nghỉ học vì lý do này được cho phép).',
      },
      {
        word: 'horoscope',
        ipa: 'ˈhɒrəskəʊp',
        pos: 'n',
        meaning: 'tử vi / lá số tử vi (dự đoán theo cung hoàng đạo)',
        example: 'She reads her horoscope in the newspaper every morning.',
        note: 'Liên quan: astrology (n): chiêm tinh học; star sign (n): cung hoàng đạo.',
      },
      {
        word: 'optimistic',
        focus: 'ic',
        ipa: 'ˌɒptɪˈmɪstɪk',
        pos: 'adj',
        meaning: 'lạc quan',
        family: [{ word: 'optimism', pos: 'n', meaning: 'sự lạc quan' }],
        example: 'She is optimistic about passing the exam.',
        note: 'Be optimistic about sth. Trái nghĩa: pessimistic (bi quan).',
      },
    ],
  },
  {
    date: '2026-10-21',
    title: 'Reading – Vocab revision 2 (ROOT Week 4)',
    words: [
      {
        word: 'ensure sth',
        focus: 'en',
        ipa: 'ɪnˈʃʊə(r)',
        pos: 'v',
        meaning: 'đảm bảo',
        family: [{ word: 'sure', pos: 'adj', meaning: 'chắc chắn' }],
        example: "To ensure his dog's safety, Tam built a strong fence around the yard.",
        note: 'Ensure (that) + mệnh đề: She ensured she had her IELTS certificate and passport.',
      },
      {
        word: 'certificate',
        focus: 'tif',
        ipa: 'səˈtɪfɪkət',
        pos: 'n',
        meaning: 'chứng chỉ / giấy chứng nhận',
        family: [{ word: 'certify sth', pos: 'v', meaning: 'chứng nhận' }],
        example: 'She received a certificate for completing the first training course last week.',
        note: 'Đuôi -ate trong danh từ đọc /ət/, không phải /eɪt/.',
      },
      {
        word: 'passport',
        ipa: 'ˈpɑːspɔːt',
        pos: 'n',
        meaning: 'hộ chiếu',
        example: 'You should not forget to bring your passport when you travel internationally.',
        note: 'To travel abroad, you must ensure your passport and visa are up-to-date.',
      },
      {
        word: 'value sth',
        ipa: 'ˈvæljuː',
        pos: 'v',
        meaning: 'coi trọng / trân trọng',
        family: [
          { word: 'value', pos: 'n', meaning: 'giá trị' },
          { word: 'valuable', pos: 'adj', meaning: 'quý giá' },
        ],
        example: 'We value honesty and trust in our family above all other qualities.',
        note: 'She valued this opportunity and couldn’t wait to experience a new country.',
      },
      {
        word: 'encounter sb/sth',
        focus: 'coun',
        ipa: 'ɪnˈkaʊntə(r)',
        pos: 'v',
        meaning: 'chạm trán / gặp phải (khó khăn, vấn đề)',
        example: 'At the airport, she encountered a problem: her suitcase was overweight.',
        note: 'Encounter a problem / difficulties / bad weather.',
      },
      {
        word: 'curious',
        focus: 'ious',
        ipa: 'ˈkjʊəriəs',
        pos: 'adj',
        meaning: 'tò mò / hiếu kì',
        family: [{ word: 'curiosity', pos: 'n', meaning: 'sự tò mò' }],
        example: 'Children are naturally curious and love to explore the world around them.',
        note: 'Be curious about sth: She was curious about what was in her suitcase.',
      },
      {
        word: 'cope with sth',
        ipa: 'kəʊp',
        pos: 'v',
        meaning: 'đương đầu / đối phó với',
        example:
          'He learned to cope with stress by practicing meditation and deep breathing exercises.',
        note: 'When Ngoc feels stressed, she finds it hard to cope with the pressure.',
      },
      {
        word: 'depend on sb/sth',
        focus: 'pend',
        ipa: 'dɪˈpend',
        pos: 'v',
        meaning: 'dựa vào / phụ thuộc vào',
        family: [
          { word: 'dependent', pos: 'adj', meaning: 'phụ thuộc' },
          { word: 'independent', pos: 'adj', meaning: 'độc lập' },
        ],
        example: 'You can depend on a good friend to help you in difficult times.',
        note: 'Luôn đi với "on": Nhi must depend on luck for this!',
      },
      {
        word: 'fence',
        ipa: 'fens',
        pos: 'n',
        meaning: 'hàng rào',
        example: "To ensure his dog's safety, Tam built a strong fence around the yard.",
      },
      {
        word: 'breathing exercises',
        ipa: 'ˈbriːðɪŋ ˈeksəsaɪzɪz',
        pos: 'n',
        meaning: 'bài tập hít thở',
        family: [
          { word: 'breath', pos: 'n', meaning: 'hơi thở (/breθ/)' },
          { word: 'breathe', pos: 'v', meaning: 'thở (/briːð/)' },
        ],
        example: 'Deep breathing exercises help you relax when you feel stressed.',
        note: 'Breath (n) /θ/ ≠ breathe (v) /ð/.',
      },
    ],
    blanks: [
      {
        text: "To [ensure] his dog's safety, Tam built a strong [fence] around the yard.",
        hint: 'đảm bảo · hàng rào',
      },
      {
        text: 'When Ngoc feels stressed, she finds it hard to [cope with] the pressure.',
        hint: 'đương đầu với',
      },
      {
        text: 'We [value] honesty and trust in our family above all other qualities.',
        hint: 'coi trọng',
      },
      {
        text: 'During our trip, we had to [encounter] bad weather because it was the rainy season.',
        hint: 'gặp phải',
      },
      {
        text: 'She received a [certificate] for completing the first training course last week.',
        hint: 'chứng chỉ',
      },
      {
        text: 'You should not forget to bring your [passport] when you travel internationally.',
        hint: 'hộ chiếu',
      },
      {
        text: 'Children are naturally [curious] and love to explore the world around them.',
        hint: 'tò mò',
      },
      {
        text: 'He learned to [cope with] stress by practicing meditation and deep [breathing exercises].',
        hint: 'đương đầu với · bài tập hít thở',
      },
      {
        text: 'To travel abroad, you must [ensure] your passport and visa are up-to-date.',
        hint: 'đảm bảo',
      },
      {
        text: 'You can [depend on] a good friend to help you in difficult times.',
        hint: 'dựa vào',
      },
    ],
  },
  {
    date: '2026-10-26',
    title: 'Reading – Vocab revision 1 (ROOT Week 5)',
    words: [
      {
        word: 'profitable',
        focus: 'able',
        ipa: 'ˈprɒfɪtəbl',
        pos: 'adj',
        meaning: 'có lợi nhuận / sinh lời',
        family: [{ word: 'profit', pos: 'n', meaning: 'lợi nhuận' }],
        example: 'Tom dreamed of opening a profitable fitness café.',
        note: 'The unique concept made his café both popular and profitable.',
      },
      {
        word: 'active',
        ipa: 'ˈæktɪv',
        pos: 'adj',
        meaning: 'năng động / tích cực',
        family: [{ word: 'activity', pos: 'n', meaning: 'hoạt động' }],
        example:
          'He was very active and wanted to influence others to adopt a healthier lifestyle.',
      },
      {
        word: 'influence sb/sth',
        focus: 'in',
        ipa: 'ˈɪnfluəns',
        pos: 'v',
        meaning: 'ảnh hưởng / tác động đến',
        example: "Good teachers can greatly influence their students' lives.",
        note: 'Động từ không có giới từ: influence sb. Danh từ: have an influence on sb/sth.',
      },
      {
        word: 'skyscraper',
        focus: 'sky',
        ipa: 'ˈskaɪskreɪpə(r)',
        pos: 'n',
        meaning: 'toà nhà chọc trời',
        example: 'Tom went to many gyms and cafés in a skyscraper near his house.',
        note: 'sky (bầu trời) + scrape (cào) → toà nhà cao "cào" tới trời.',
      },
      {
        word: 'pretend',
        focus: 'tend',
        ipa: 'prɪˈtend',
        pos: 'v',
        meaning: 'giả vờ',
        example: 'He pretended to be a customer to learn their practices.',
        note: 'Pretend to be / to do sth; pretend (that) + mệnh đề.',
      },
      {
        word: 'practice',
        ipa: 'ˈpræktɪs',
        pos: 'n',
        meaning: 'cách làm / thói quen (của một nơi, một nghề)',
        family: [{ word: 'practise', pos: 'v', meaning: 'luyện tập (Anh-Anh viết -ise)' }],
        example: 'He pretended to be a customer to learn their practices.',
        note: 'Anh-Anh: practice (n) ≠ practise (v). Business practices: cách vận hành kinh doanh.',
      },
      {
        word: 'conduct sth',
        focus: 'duct',
        ipa: 'kənˈdʌkt',
        pos: 'v',
        meaning: 'tiến hành / thực hiện',
        example: 'He then conducted a survey to understand what customers like.',
        note: 'Conduct a survey / an experiment / research. Danh từ conduct /ˈkɒndʌkt/: hạnh kiểm.',
      },
      {
        word: 'originate',
        focus: 'rig',
        ipa: 'əˈrɪdʒɪneɪt',
        pos: 'v',
        meaning: 'bắt nguồn / khởi nguồn',
        family: [
          { word: 'origin', pos: 'n', meaning: 'nguồn gốc' },
          { word: 'original', pos: 'adj', meaning: 'nguyên bản / ban đầu' },
        ],
        example: 'The custom of decorating trees during Christmas originated from Germany.',
        note: 'Originate from / in: "Bun bo Hue" originated in Hue.',
      },
      {
        word: 'experiment',
        focus: 'per',
        ipa: 'ɪkˈsperɪmənt',
        pos: 'n',
        meaning: 'thí nghiệm',
        example: 'Researchers needed to conduct experiments to find the vaccine for Covid-19.',
        note: 'Conduct / carry out / do an experiment.',
      },
      {
        word: 'ancient',
        focus: 'an',
        ipa: 'ˈeɪnʃənt',
        pos: 'adj',
        meaning: 'cổ đại / rất xưa',
        example:
          'The idea of celebrating birthdays with cake and candles originated from ancient Rome.',
        note: 'Đọc /ˈeɪn/, không phải /ˈæn/. Ancient Rome / Egypt / Greece.',
      },
    ],
    blanks: [
      { text: 'Tom dreamed of opening a [profitable] fitness café.', hint: 'có lợi nhuận' },
      {
        text: 'He was very [active] and wanted to [influence] others to adopt a healthier lifestyle.',
        hint: 'năng động · ảnh hưởng',
      },
      {
        text: 'Tom went to many gyms and cafés in a [skyscraper] near his house.',
        hint: 'toà nhà chọc trời',
      },
      {
        text: 'He [pretended] to be a customer to learn their [practices].',
        hint: 'giả vờ (quá khứ) · cách làm (số nhiều)',
      },
      {
        text: 'He then [conducted] a survey to understand what customers like.',
        hint: 'tiến hành (quá khứ)',
      },
      {
        text: 'Researchers needed to [conduct] [experiments] to find the vaccine for Covid-19.',
        hint: 'tiến hành · thí nghiệm',
      },
      {
        text: 'The custom of decorating trees during Christmas [originated] from Germany.',
        hint: 'bắt nguồn (quá khứ)',
      },
      { text: "Good teachers can greatly [influence] their students' lives.", hint: 'ảnh hưởng' },
      {
        text: 'The idea of celebrating birthdays with cake and candles [originated] from [ancient] Rome.',
        hint: 'bắt nguồn (quá khứ) · cổ đại',
      },
    ],
  },
  {
    date: '2026-10-27',
    title: 'Reading – Culture Shock',
    words: [
      {
        word: 'similarity',
        focus: 'lar',
        ipa: 'ˌsɪməˈlærəti',
        pos: 'n',
        meaning: 'sự giống nhau / điểm tương đồng',
        family: [{ word: 'similar', pos: 'adj', meaning: 'giống, tương tự' }],
        example: 'Differences and similarities are accepted.',
        note: 'Similar to sth; similarity between A and B.',
      },
      {
        word: 'cope with sth',
        ipa: 'kəʊp',
        pos: 'v',
        meaning: 'ứng phó / xử lý việc gì đó',
        example: 'You feel well able to cope with new situations based on your growing experience.',
      },
      {
        word: 'based on sth',
        ipa: 'beɪst',
        pos: 'adj',
        meaning: 'dựa trên',
        example: 'You feel well able to cope with new situations based on your growing experience.',
        note: 'Be based on: The film is based on a true story.',
      },
      {
        word: 'intriguing',
        focus: 'trig',
        ipa: 'ɪnˈtriːɡɪŋ',
        pos: 'adj',
        meaning: 'hấp dẫn / gây tò mò',
        family: [{ word: 'intrigue sb', pos: 'v', meaning: 'khiến ai tò mò, thích thú' }],
        example: 'When you first arrive in a new culture, differences are intriguing.',
        note: '-ing: thứ gây cảm xúc (intriguing differences); -ed: người cảm thấy (I was intrigued).',
      },
      {
        word: 'curious',
        focus: 'ious',
        ipa: 'ˈkjʊəriəs',
        pos: 'adj',
        meaning: 'tò mò',
        family: [{ word: 'curiosity', pos: 'n', meaning: 'sự tò mò' }],
        example: 'You may feel excited, stimulated and curious.',
      },
      {
        word: 'stage',
        ipa: 'steɪdʒ',
        pos: 'n',
        meaning: 'giai đoạn',
        example: 'At this stage you are still protected by the close memory of your home culture.',
        note: 'At this stage; the early / final stage.',
      },
      {
        word: 'value sth',
        ipa: 'ˈvæljuː',
        pos: 'v',
        meaning: 'xem trọng / coi trọng cái gì',
        example: 'Differences and similarities are valued and important.',
        note: 'Ở đây dùng passive voice (be valued). Values (n, số nhiều): giá trị sống.',
      },
      {
        word: 'potential',
        focus: 'ten',
        ipa: 'pəˈtenʃl',
        pos: 'n',
        meaning: 'tiềm năng',
        example:
          'You may feel full of potential and able to trust yourself in all kinds of situations.',
        note: 'Full of potential; reach your full potential. Cũng là adj: potential customers.',
      },
      {
        word: 'according to',
        ipa: 'əˈkɔːdɪŋ tə',
        pos: 'prep',
        meaning: 'căn cứ theo / theo như',
        example: 'You are able to make choices according to your preferences and values.',
      },
      {
        word: 'preference',
        focus: 'pref',
        ipa: 'ˈprefrəns',
        pos: 'n',
        meaning: 'sở thích / điều mình ưu tiên hơn',
        family: [{ word: 'prefer sth', pos: 'v', meaning: 'thích cái gì hơn' }],
        example: 'You are able to make choices according to your preferences and values.',
        note: 'Prefer A to B; have a preference for sth. Trọng âm: preFER (v) → PREFerence (n).',
      },
      {
        word: 'confused',
        focus: 'fused',
        ipa: 'kənˈfjuːzd',
        pos: 'adj',
        meaning: 'bị bối rối / rối loạn',
        family: [{ word: 'confuse sb', pos: 'v', meaning: 'làm ai đó bối rối' }],
        example: 'Differences create an impact and you may feel confused, isolated or inadequate.',
        note: 'Confused (người cảm thấy) ≠ confusing (thứ gây rối).',
      },
      {
        word: 'isolated',
        ipa: 'ˈaɪsəleɪtɪd',
        pos: 'adj',
        meaning: 'bị cô lập / lẻ loi',
        family: [
          { word: 'isolate sb/sth', pos: 'v', meaning: 'cô lập' },
          { word: 'isolation', pos: 'n', meaning: 'sự cô lập' },
        ],
        example: 'You may feel confused, isolated or inadequate.',
      },
      {
        word: 'inadequate',
        focus: 'in',
        ipa: 'ɪnˈædɪkwət',
        pos: 'adj',
        meaning: 'thấy mình kém cỏi / không đủ (khả năng)',
        family: [{ word: 'adequate', pos: 'adj', meaning: 'đủ, thoả đáng' }],
        example:
          'You may feel inadequate as you start to notice more and more cultural differences.',
        note: 'in + adequate. Đuôi -ate trong tính từ đọc /ət/.',
      },
      {
        word: 'encounter sth',
        focus: 'coun',
        ipa: 'ɪnˈkaʊntə(r)',
        pos: 'v',
        meaning: 'đương đầu / đối mặt với cái gì',
        example: 'Next you may reject the differences you encounter.',
      },
      {
        word: 'frustrated',
        focus: 'stra',
        ipa: 'frʌˈstreɪtɪd',
        pos: 'adj',
        meaning: 'cảm thấy nản lòng / bực bội',
        family: [{ word: 'frustrate sb', pos: 'v', meaning: 'làm nản lòng ai đó' }],
        example: 'You may feel angry or frustrated, or hostile to the new culture.',
        note: 'Kiểu như làm mãi mà không có kết quả thì thấy rất frustrated. Frustrating: gây nản lòng.',
      },
      {
        word: 'hostile',
        ipa: 'ˈhɒstaɪl',
        pos: 'adj',
        meaning: 'thù địch / chống đối',
        family: [{ word: 'hostility', pos: 'n', meaning: 'sự thù địch' }],
        example: 'You may feel angry or frustrated, or hostile to the new culture.',
        note: 'Hostile to / towards sb/sth.',
      },
      {
        word: 'conscious',
        ipa: 'ˈkɒnʃəs',
        pos: 'adj',
        meaning: 'ý thức được / nhận thức rõ',
        family: [{ word: 'consciousness', pos: 'n', meaning: 'ý thức' }],
        example:
          'At this stage you may be conscious mainly of how much you dislike it compared to home.',
        note: 'Be conscious of sth. "sc" đọc /ʃ/: /ˈkɒnʃəs/.',
      },
      {
        word: 'reaction',
        focus: 'ac',
        ipa: 'riˈækʃn',
        pos: 'n',
        meaning: 'sự phản ứng',
        family: [{ word: 'react', pos: 'v', meaning: 'phản ứng' }],
        example: "Don't worry as this is quite a healthy reaction.",
        note: 'Reaction to sth; react to sth.',
      },
    ],
    blanks: [
      {
        text: 'Differences and [similarities] are accepted.',
        hint: 'điểm tương đồng (số nhiều)',
      },
      {
        text: 'You feel well able to [cope with] new situations [based on] your growing experience.',
        hint: 'ứng phó với · dựa trên',
      },
      {
        text: 'When you first arrive in a new culture, differences are [intriguing] and you may feel excited, stimulated and [curious].',
        hint: 'gây tò mò · tò mò',
      },
      {
        text: 'At this [stage] you are still protected by the close memory of your home culture.',
        hint: 'giai đoạn',
      },
      {
        text: 'Differences and similarities are [valued] and important.',
        hint: 'được coi trọng (bị động)',
      },
      {
        text: 'You may feel full of [potential] and able to trust yourself in all kinds of situations.',
        hint: 'tiềm năng',
      },
      {
        text: 'You are able to make choices [according to] your [preferences] and values.',
        hint: 'căn cứ theo · sở thích (số nhiều)',
      },
      {
        text: 'You may feel [confused], [isolated] or [inadequate] as you start to notice more cultural differences.',
        hint: 'bối rối · lẻ loi · kém cỏi',
      },
      {
        text: 'Next you may reject the differences you [encounter].',
        hint: 'đối mặt',
      },
      {
        text: 'You may feel angry or [frustrated], or [hostile] to the new culture.',
        hint: 'nản lòng · thù địch',
      },
      {
        text: 'You may be [conscious] mainly of how much you dislike it compared to home.',
        hint: 'ý thức được',
      },
      { text: "Don't worry as this is quite a healthy [reaction].", hint: 'sự phản ứng' },
    ],
  },
  {
    date: '2026-10-28',
    title: 'Reading – Classic tours: Coach break information',
    words: [
      {
        word: 'medium-sized',
        ipa: 'ˈmiːdiəm saɪzd',
        pos: 'adj',
        meaning: 'cỡ vừa / cỡ trung bình',
        family: [
          { word: 'medium', pos: 'adj', meaning: 'vừa' },
          { word: 'size', pos: 'n', meaning: 'kích cỡ' },
        ],
        example: 'We ask you to keep luggage down to one medium-sized suitcase per person.',
        note: 'Cùng kiểu: small-sized, large-sized, a medium-sized company.',
      },
      {
        word: 'holdall',
        ipa: 'ˈhəʊldɔːl',
        pos: 'n',
        meaning: 'túi xách du lịch (túi vải lớn, mềm)',
        example: 'A small holdall can also be taken on board the coach.',
      },
      {
        word: 'advisable',
        focus: 'vis',
        ipa: 'ədˈvaɪzəbl',
        pos: 'adj',
        meaning: 'nên làm / được khuyến khích',
        family: [{ word: 'advise sb to do sth', pos: 'v', meaning: 'khuyên' }],
        example:
          'Since allocations are made on a first come first served basis, early booking is advisable.',
        note: 'Không dùng trước danh từ: It is advisable to book early.',
      },
      {
        word: 'deposit',
        focus: 'pos',
        ipa: 'dɪˈpɒzɪt',
        pos: 'n',
        meaning: 'tiền cọc / tiền đặt trước',
        example: 'When you have paid your deposit we will send you all the necessary documents.',
        note: 'Pay a deposit; a deposit of £50.',
      },
      {
        word: 'departure',
        focus: 'par',
        ipa: 'dɪˈpɑːtʃə(r)',
        pos: 'n',
        meaning: 'sự khởi hành',
        family: [{ word: 'depart', pos: 'v', meaning: 'khởi hành' }],
        example: 'You receive them in good time before the coach break departure date.',
        note: 'Trái nghĩa: arrival. In good time: sớm, kịp thời.',
      },
      {
        word: 'certain',
        ipa: 'ˈsɜːtn',
        pos: 'adj',
        meaning: 'một số (nhất định) — khi đứng trước danh từ',
        example: 'Certain documents, for example, air or boat tickets, may have to be retained.',
        note: 'Certain + N: một số…; be certain (that): chắc chắn.',
      },
      {
        word: 'courier',
        ipa: 'ˈkʊriə(r)',
        pos: 'n',
        meaning: 'hướng dẫn viên đi cùng đoàn; người chuyển phát',
        example: 'Your driver or courier will then issue them to you at the relevant point.',
      },
      {
        word: 'relevant',
        focus: 'rel',
        ipa: 'ˈreləvənt',
        pos: 'adj',
        meaning: 'có liên quan / thích hợp',
        family: [{ word: 'relevance', pos: 'n', meaning: 'sự liên quan' }],
        example: 'Your driver or courier will then issue them to you at the relevant point.',
        note: 'Ở đây: vé được đưa cho bạn khi đến đúng điểm cần dùng vé đó. Trái nghĩa: irrelevant.',
      },
      {
        word: 'whilst',
        ipa: 'waɪlst',
        pos: 'conj',
        meaning: 'trong khi / mặc dù (= while, Anh-Anh trang trọng)',
        example:
          'Whilst offering value for money within the price range, they may not have the full facilities to cope with special diets.',
      },
      {
        word: 'facilities',
        focus: 'cil',
        ipa: 'fəˈsɪlətiz',
        pos: 'n',
        meaning: 'cơ sở vật chất / tiện nghi',
        example: 'They may not have the full facilities to cope with special diets.',
        note: 'Private facilities: phòng tắm/vệ sinh riêng trong phòng.',
      },
      {
        word: 'cope with sth',
        ipa: 'kəʊp',
        pos: 'v',
        meaning: 'xử lý được / đáp ứng được',
        example: 'They may not have the full facilities to cope with special diets.',
      },
      {
        word: 'incur sth',
        focus: 'cur',
        ipa: 'ɪnˈkɜː(r)',
        pos: 'v',
        meaning: 'phải chịu (chi phí, thiệt hại)',
        example:
          'Any extra costs incurred must be paid to the hotel by yourself before departure from the hotel.',
        note: 'Incur costs / expenses / a fine. Quá khứ: incurred (nhân đôi r).',
      },
      {
        word: 'accommodation',
        focus: 'da',
        ipa: 'əˌkɒməˈdeɪʃn',
        pos: 'n',
        meaning: 'chỗ ở',
        family: [{ word: 'accommodate sb', pos: 'v', meaning: 'cung cấp chỗ ở / chứa được' }],
        example:
          'Many of our coach-breaks now include, within the price, accommodation with private facilities.',
        note: 'Không đếm được (Anh-Anh): không nói "an accommodation". Viết 2 c, 2 m.',
      },
      {
        word: 'subject to sth',
        ipa: 'ˈsʌbdʒɪkt',
        pos: 'adj',
        meaning: 'tuỳ thuộc vào / phải chịu',
        example:
          'Rooms with private facilities, subject to availability, can be reserved at the time of booking.',
        note: 'Subject to availability: tuỳ còn chỗ; be subject to a charge: phải chịu phí.',
      },
      {
        word: 'supplementary',
        focus: 'men',
        ipa: 'ˌsʌplɪˈmentri',
        pos: 'adj',
        meaning: 'bổ sung / phụ thêm',
        family: [{ word: 'supplement', pos: 'n', meaning: 'phần bổ sung / phụ phí' }],
        example: 'The supplementary charge shown in the price panel will be added to your account.',
      },
      {
        word: 'brochure',
        ipa: 'ˈbrəʊʃə(r)',
        pos: 'n',
        meaning: 'tờ quảng cáo / sách giới thiệu',
        example:
          'A single room may be subject to a supplementary charge and this will be shown on the brochure page.',
        note: '"ch" đọc /ʃ/ như trong chef.',
      },
      {
        word: 'frequency',
        focus: 'fre',
        ipa: 'ˈfriːkwənsi',
        pos: 'n',
        meaning: 'tần suất',
        family: [{ word: 'frequent', pos: 'adj', meaning: 'thường xuyên' }],
        example:
          'The nature and frequency of the entertainment presented is at the discretion of the hotel.',
      },
      {
        word: 'discretion',
        focus: 'cre',
        ipa: 'dɪˈskreʃn',
        pos: 'n',
        meaning: 'quyền tự quyết / sự tuỳ ý',
        example:
          'The entertainment is at the discretion of the hotel and therefore not guaranteed.',
        note: 'At the discretion of sb / at sb’s discretion: do ai đó quyết định.',
      },
      {
        word: 'therefore',
        ipa: 'ˈðeəfɔː(r)',
        pos: 'adv',
        meaning: 'vì vậy / do đó',
        example:
          'The entertainment is at the discretion of the hotel and therefore not guaranteed.',
        note: 'Từ nối trang trọng, dùng tốt trong IELTS Writing.',
      },
      {
        word: 'withdraw sth',
        focus: 'draw',
        ipa: 'wɪðˈdrɔː',
        pos: 'v',
        meaning: 'rút lại / huỷ bỏ; rút (tiền)',
        example: 'It could be withdrawn if there is a lack of demand.',
        note: 'withdraw – withdrew – withdrawn. Withdraw money: rút tiền.',
      },
      {
        word: 'demand',
        ipa: 'dɪˈmɑːnd',
        pos: 'n',
        meaning: 'nhu cầu',
        example: 'It could be withdrawn if there is a lack of demand or insufficient numbers.',
        note: 'A lack of demand; demand for sth; supply and demand.',
      },
      {
        word: 'insufficient',
        focus: 'in',
        ipa: 'ˌɪnsəˈfɪʃnt',
        pos: 'adj',
        meaning: 'không đủ',
        family: [{ word: 'sufficient', pos: 'adj', meaning: 'đủ' }],
        example: 'It could be withdrawn if there are insufficient numbers in the hotel.',
        note: 'in + sufficient. Insufficient numbers: không đủ số người.',
      },
    ],
    blanks: [
      {
        text: 'We ask you to keep luggage down to one [medium-sized] suitcase per person, but a small [holdall] can also be taken on board the coach.',
        hint: 'cỡ vừa · túi xách du lịch',
      },
      {
        text: 'Since allocations are made on a first come first served basis, early booking is [advisable].',
        hint: 'nên làm',
      },
      {
        text: 'When you have paid your [deposit] we will send you all the necessary documents before the [departure] date.',
        hint: 'tiền cọc · sự khởi hành',
      },
      {
        text: '[Certain] documents may have to be retained and your driver or [courier] will issue them to you at the [relevant] point.',
        hint: 'một số · hướng dẫn viên · có liên quan',
      },
      {
        text: '[Whilst] offering value for money, they may not have the full [facilities] to [cope] with special diets.',
        hint: 'trong khi · tiện nghi · đáp ứng',
      },
      {
        text: 'Any extra costs [incurred] must be paid to the hotel by yourself.',
        hint: 'phải chịu (quá khứ phân từ)',
      },
      {
        text: 'Rooms with private facilities, [subject to] availability, can be reserved — the [supplementary] charge will be added to your account.',
        hint: 'tuỳ thuộc vào · phụ thêm',
      },
      {
        text: 'A single room may be subject to a supplementary charge and this will be shown on the [brochure] page.',
        hint: 'sách giới thiệu',
      },
      {
        text: 'The nature and [frequency] of the entertainment is at the [discretion] of the hotel and [therefore] not guaranteed.',
        hint: 'tần suất · quyền tự quyết · vì vậy',
      },
      {
        text: 'It could be [withdrawn] if there is a lack of [demand] or [insufficient] numbers in the hotel.',
        hint: 'rút lại (V3) · nhu cầu · không đủ',
      },
    ],
  },
  {
    date: '2026-10-30',
    title: 'Reading – Enrique Iglesias',
    words: [
      {
        word: 'get divorced',
        focus: 'vor',
        ipa: 'dɪˈvɔːst',
        pos: 'v',
        meaning: 'ly hôn',
        family: [{ word: 'divorce', pos: 'n', meaning: 'sự ly hôn' }],
        example: 'When he was 3 years old, his parents got divorced.',
        note: 'Get divorced (không có tân ngữ) = divorce sb. Trái nghĩa: get married. "-ced" đọc /st/.',
      },
      {
        word: 'several',
        ipa: 'ˈsevrəl',
        pos: 'det',
        meaning: 'một vài / nhiều (hơn 2, không quá nhiều)',
        example: 'He sent some of his songs to several record companies.',
        note: 'Several + danh từ đếm được số nhiều: several times, several days. Đọc 2 âm tiết /ˈsevrəl/.',
      },
      {
        word: 'eventually',
        focus: 'ven',
        ipa: 'ɪˈventʃuəli',
        pos: 'adv',
        meaning: 'cuối cùng thì (sau một thời gian dài / nhiều khó khăn)',
        family: [{ word: 'eventual', pos: 'adj', meaning: 'cuối cùng' }],
        example: 'He eventually got a contract with a Mexican record company.',
        note: 'Không có nghĩa "có lẽ". Gần nghĩa: finally, in the end.',
      },
    ],
    blanks: [
      {
        text: 'When he was 3 years old, his parents [got divorced], and later he moved to Miami to live with his father.',
        hint: 'ly hôn (quá khứ)',
      },
      {
        text: 'When he sent some of his songs to [several] record companies, he used the name Enrique Martinez.',
        hint: 'một vài',
      },
      {
        text: 'He [eventually] got a contract with a Mexican record company.',
        hint: 'cuối cùng thì',
      },
    ],
  },
]

/** Vocabulary for one 'YYYY-MM-DD' day, if any. */
export function getVocabularyByDate(date: string): VocabDay | undefined {
  return vocabulary.find((day) => day.date === date)
}

/**
 * Practice for a day's words: flashcards (word → meaning) and "Which word means…?" questions
 * whose wrong options are other words from the same day, plus the day's gap-filling sentences.
 */
export function getVocabExercises(day: VocabDay): ExerciseSet {
  const lessonId = `vocab:${day.date}`
  const flashcards = day.words.map((w): Flashcard => ({
    id: `${lessonId}:card:${w.word}`,
    kind: 'flashcard',
    lessonId,
    front: w.word,
    back: w.meaning,
    note: [w.ipa && `/${w.ipa}/`, `(${w.pos})`, w.example].filter(Boolean).join(' · '),
  }))
  const quiz =
    day.words.length < 4
      ? []
      : day.words.map((w): QuizQuestion => {
          const others = shuffle(day.words.filter((o) => o !== w)).slice(0, 3)
          return {
            id: `${lessonId}:quiz:${w.word}`,
            kind: 'quiz',
            lessonId,
            prompt: `Which word means "${w.meaning}"?`,
            options: [w.word, ...others.map((o) => o.word)],
            answer: 0,
            explanation: w.family?.length
              ? [...w.family, w].map((f) => `${f.word} (${f.pos})`).join(' → ')
              : w.note,
          }
        })
  const blanks = (day.blanks ?? []).map((blank): BlankExercise => ({
    id: `${lessonId}:blank:${blank.text}`,
    kind: 'blank',
    lessonId,
    parts: parseBlanks(blank.text),
    hint: blank.hint,
    hintLabel: 'Meaning',
  }))
  return { flashcards, quiz, blanks, rewrite: [] }
}
